import { v4 as uuidv4 } from "uuid";
import { PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, tables } from "../config/dynamo.js";

const isManager = (user) => user?.role === "Manager";

export const createProject = async (req, res) => {
  const { name, description, teamId } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (!isManager(user)) {
    return res.status(403).json({ error: "Only managers can create projects" });
  }

  if (!name || !teamId) {
    return res.status(400).json({ error: "Project name and teamId are required" });
  }

  const now = new Date().toISOString();
  const project = {
    projectId: uuidv4(),
    name,
    description: description || "",
    teamId,
    createdBy: user.name,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await ddb.send(new PutCommand({ TableName: tables.PROJECTS, Item: project }));
    return res.status(201).json(project);
  } catch (error) {
    console.error("createProject error", error);
    return res.status(500).json({ error: "Failed to create project" });
  }
};

export const getProjects = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    if (isManager(user)) {
      const result = await ddb.send(new ScanCommand({ TableName: tables.PROJECTS }));
      return res.status(200).json(result.Items || []);
    }

    // Employees can only see projects belonging to their team.
    const result = await ddb.send(
      new ScanCommand({
        TableName: tables.PROJECTS,
        FilterExpression: "teamId = :teamId",
        ExpressionAttributeValues: {
          ":teamId": user.teamId,
        },
      })
    );
    return res.status(200).json(result.Items || []);
  } catch (error) {
    console.error("getProjects error", error);
    return res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const getProjectById = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  if (!user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const result = await ddb.send(new GetCommand({ TableName: tables.PROJECTS, Key: { projectId: id } }));
    const project = result.Item;

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (!isManager(user) && project.teamId !== user.teamId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error("getProjectById error", error);
    return res.status(500).json({ error: "Failed to fetch project" });
  }
};

export const updateProject = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { name, description, teamId } = req.body;

  if (!user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (!isManager(user)) {
    return res.status(403).json({ error: "Only managers can update projects" });
  }

  const fields = {};
  if (name !== undefined) fields.name = name;
  if (description !== undefined) fields.description = description;
  if (teamId !== undefined) fields.teamId = teamId;

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: "No valid fields provided for update" });
  }

  const updates = [];
  const expressionAttributeValues = { ":updatedAt": new Date().toISOString() };
  const expressionAttributeNames = {};

  Object.entries(fields).forEach(([key, value], index) => {
    const attrName = `#field${index}`;
    const attrValue = `:value${index}`;
    expressionAttributeNames[attrName] = key;
    expressionAttributeValues[attrValue] = value;
    updates.push(`${attrName} = ${attrValue}`);
  });

  const updateExpression = `SET ${updates.join(", ")}, updatedAt = :updatedAt`;

  try {
    const result = await ddb.send(
      new UpdateCommand({
        TableName: tables.PROJECTS,
        Key: { projectId: id },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
    );
    return res.status(200).json(result.Attributes);
  } catch (error) {
    console.error("updateProject error", error);
    return res.status(500).json({ error: "Failed to update project" });
  }
};

export const deleteProject = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  if (!user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (!isManager(user)) {
    return res.status(403).json({ error: "Only managers can delete projects" });
  }

  try {
    await ddb.send(new DeleteCommand({ TableName: tables.PROJECTS, Key: { projectId: id } }));
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("deleteProject error", error);
    return res.status(500).json({ error: "Failed to delete project" });
  }
};

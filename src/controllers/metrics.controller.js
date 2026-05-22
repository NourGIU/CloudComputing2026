import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, tables } from "../config/dynamo.js";

const toDateKey = (iso) => iso ? iso.split("T")[0] : null;

export const getMetrics = async (req, res) => {
  try {
    const tasksRes = await ddb.send(new ScanCommand({ TableName: tables.TASKS }));
    const tasks = tasksRes.Items || [];

    // Tasks created per day (last 14 days)
    const createdPerDay = {};
    const closedPerDayPerTeam = {};
    const timeToClose = [];

    const now = new Date();
    const earliest = new Date(now);
    earliest.setDate(now.getDate() - 13);

    for (const t of tasks) {
      const createdKey = toDateKey(t.createdAt);
      if (createdKey) createdPerDay[createdKey] = (createdPerDay[createdKey] || 0) + 1;

      if (t.status === "Done" && t.updatedAt) {
        const closedKey = toDateKey(t.updatedAt);
        if (closedKey) {
          closedPerDayPerTeam[t.teamId] = closedPerDayPerTeam[t.teamId] || {};
          closedPerDayPerTeam[t.teamId][closedKey] = (closedPerDayPerTeam[t.teamId][closedKey] || 0) + 1;
        }

        if (t.createdAt && t.updatedAt) {
          const created = new Date(t.createdAt);
          const closed = new Date(t.updatedAt);
          timeToClose.push((closed - created) / 1000 / 3600); // hours
        }
      }
    }

    const avgTimeToClose = timeToClose.length ? timeToClose.reduce((a,b)=>a+b,0)/timeToClose.length : null;

    return res.status(200).json({ createdPerDay, closedPerDayPerTeam, avgTimeToClose });
  } catch (err) {
    console.error("getMetrics error", err);
    return res.status(500).json({ error: "Failed to compute metrics" });
  }
};

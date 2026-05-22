export const mockAuth = (req, res, next) => {
  req.user = {
    userId: "user-1",
    name: "Nour",
    role: "Manager",
    teamId: "team-1",
  };

  next();
};
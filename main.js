const express = require("express");
const app = express();
const db = require("./models/index");
const { Member } = db;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("URL should contain /api/...");
});

app.get("/api/members", async (req, res) => {
  const { team } = req.query;

  if (team) {
    const teamMembers = await Member.findAll({ where: { team: team } });
    res.send(teamMembers);
  } else {
    const members = await Member.findAll();
    res.send(members);
  }
});

app.get("/api/members/:id", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findOne({ where: { id: id } });
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ message: "There is no member with the id!" });
  }
});

app.get("/users/:id", (req, res) => {
  const userName = users[req.params.id - 1];
  res.end(`<h1>${userName}</h1>`);
});

app.get("*", (req, res) => {
  res.end("<h1>404</h1>");
});

app.post("/api/members", async (req, res) => {
  const newMember = req.body;
  const member = Member.build(newMember);
  await member.save();
  res.send(member);
});

/*app.put("/api/members/:id", async (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const result = await Member.update(newInfo, { where: { id } });
  if (result[0]) {
    res.send({ message: `${result[0]} row(s) affected` });
  } else {
    res.status(404).send({ message: "There is no member with the id!" });
  }
});*/

app.put("/api/members/:id", async (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    Object.keys(newInfo).forEach((prop) => {
      member[prop] = newInfo[prop];
    });
    await member.save();
    res.send(member);
  } else {
    res.status(404).send({ message: "There is no member with the id!" });
  }
});

app.delete("/api/members/:id", async (req, res) => {
  const { id } = req.params;
  const deletedCount = await Member.destroy({ where: { id } });
  if (deletedCount) {
    res.send({ message: `${deletedCount} row(s) deleted` });
  } else {
    res.status(404).send({ message: "There is no member with the id!" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server is listening"));

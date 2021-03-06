const validateLoginInput = require("../validation/login");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const Session = require("../models/session-model").model;

const generateSessionId = () => {
  const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 256));
  return Array.from(arr, val => val.toString(16)).join("");
};

getSessions = async (req, res) => {
  return await Session.find({}, (err, sessions) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!sessions.length) {
      return res
        .status(404)
        .json({ success: false, error: `Session not found` });
    }
    return res.status(200).json({ success: true, data: sessions });
  }).catch(err => console.log(err));
};

getUniqueSessionId = async (req, res) => {
  let id = generateSessionId();
  while (await Session.exists({ _id: id })) {
    id = generateSessionId();
  }
  return id;
};

createSession = async (req, res) => {
  const sessionId = await getUniqueSessionId();
  const session = new Session({
    _id: sessionId,
    name: req.body.sessionName || sessionId,
    menuId: req.body.menuId,
    users: [],
    menuTotalSoFar: 0,
    tipTotalSoFar: 0
  });
  session.save();
  res.send(sessionId);
};

getSessionById = async (req, res) => {
  const sessionId = req.params.sessionId;
  const session = await Session.findById(sessionId, {
    __v: 0,
    createdAt: 0,
    updatedAt: 0
  });
  session ? res.send(session) : res.sendStatus(404);
};

getSessionName = async (req, res) => {
  const sessionId = req.params.sessionId;
  const sessionName = await Session.findById(sessionId, {
    name: 1
  });
  sessionName ? res.send(sessionName) : res.sendStatus(404);
};

getSessionMenuTotalSoFar = async (req, res) => {
  const sessionId = req.params.sessionId;
  const sessionMenuTotalSoFar = await Session.findById(sessionId, {
    menuTotalSoFar: 1
  });
  sessionMenuTotalSoFar ? res.send(sessionMenuTotalSoFar) : res.sendStatus(404);
};

getSessionTipTotalSoFar = async (req, res) => {
  const sessionId = req.params.sessionId;
  const sessionTipTotalSoFar = await Session.findById(sessionId, {
    tipTotalSoFar: 1
  });
  sessionTipTotalSoFar ? res.send(sessionTipTotalSoFar) : res.sendStatus(404);
};

updateSessionName = async (req, res) => {
  const body = req.body;
  const sessionId = req.params.sessionId;
  Session.findByIdAndUpdate(
    sessionId,
    { name: body.name },
    { new: true },
    function(err, response) {
      if (err) {
        return res.json({
          message: "Database Update Failure"
        });
      }
      return res.send(response);
    }
  );
};

updateSessionMenuTotalSoFar = async (req, res) => {
  const { params: { sessionId } } = req;
  const { menuTotalSoFar } = req.body;
  Session.findByIdAndUpdate(
    sessionId,
    { menuTotalSoFar: menuTotalSoFar },
    { new: true },
    function(err, response) {
      if (err) {
        return res.json({
          message: "Database Update Failure"
        });
      }
      return res.send(response);
    }
  );
};

updateSessionTipTotalSoFar = async (req, res) => {
  const { params: { sessionId } } = req;
  const { tipTotalSoFar } = req.body;
  Session.findByIdAndUpdate(
    sessionId,
    { tipTotalSoFar: tipTotalSoFar },
    { new: true },
    function(err, response) {
      if (err) {
        return res.json({
          message: "Database Update Failure"
        });
      }
      return res.send(response);
    }
  );
};

findOrCreateUserInSession = async (req, res) => {
  const { error, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(error);
  }

  const session = await Session.findById(req.params.sessionId);

  const existingUser = session.users.find(user => user.name === req.body.name);
  const requestedUser = {
    name: req.body.name,
    password: req.body.password
  };

  if (!existingUser) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(requestedUser.password, salt, (err, hash) => {
        if (err) throw err;
        requestedUser.password = hash;
        session.users.push(requestedUser);
        session
          .save()
          .then(() => res.json(requestedUser))
          .catch(err => console.log(err));
      });
    });
  } else {
    const isMatch = await bcrypt.compare(
      requestedUser.password,
      existingUser.password
    );
    if (isMatch) {
      jwt.sign(
        requestedUser,
        keys.secretOrKey,
        {
          expiresIn: 31556926 // 1 year in seconds
        },
        (err, token) => {
          const { name, password } = existingUser;
          res.json({
            name: name,
            password: password,
            success: true,
            token: "Bearer " + token
          });
        }
      );
    } else {
      res
        .status(400)
        .json({ passwordincorrect: "Password incorrect or username is taken" });
    }
  }
};

updateUserOrder = async (req, res) => {
  const { params: { sessionId } } = req;
  const { sessionUser, order } = req.body;
  const session = await Session.findById(sessionId);
  const idx = session.users.findIndex(u => u.name === sessionUser.name);
  if (order) {
    session.users[idx].orders = order;
    session.save();
  }
  res.json(session.users[idx].orders);
};

updateUserMenuTotal = async (req, res) => {
  const { params: { sessionId } } = req;
  const { sessionUser, userMenuTotal } = req.body;
  const session = await Session.findById(sessionId);
  const idx = session.users.findIndex(u => u.name === sessionUser.name);
  if (userMenuTotal >= 0) {
    session.users[idx].menuTotal = userMenuTotal;
    session.save();
  }
  res.json(session.users[idx].menuTotal);
};

updateUserTipTotal = async (req, res) => {
  const { params: { sessionId } } = req;
  const { sessionUser, userTipTotal } = req.body;
  const session = await Session.findById(sessionId);
  const idx = session.users.findIndex(u => u.name === sessionUser.name);
  if (userTipTotal >= 0) {
    session.users[idx].tipTotal = userTipTotal;
    session.save();
  }
  res.json(session.users[idx].tipTotal);
};

getMenuTotalByUser = async (req, res) => {
  const { params: { sessionId, sessionUserName } } = req;
  const session = await Session.findById(sessionId);
  const idx = session.users.findIndex(u => u.name === sessionUserName);
  return session.users[idx].menuTotal >= 0
    ? res.send(`${session.users[idx].menuTotal}`)
    : res.sendStatus(404);
};

getTipTotalByUser = async (req, res) => {
  const { params: { sessionId, sessionUserName } } = req;
  const session = await Session.findById(sessionId);
  const idx = session.users.findIndex(u => u.name === sessionUserName);
  return session.users[idx].tipTotal >= 0
    ? res.send(`${session.users[idx].tipTotal}`)
    : res.sendStatus(404);
};

getAllOrders = async (req, res) => {
  const { params: { sessionId } } = req;
  const session = await Session.findById(sessionId);
  const orders = session.users.map((u) => u.orders).flat();
  res.send(JSON.stringify(orders));
}

module.exports = {
  getSessions,
  createSession,
  getSessionById,
  getSessionName,
  updateSessionName,
  updateUserOrder,
  findOrCreateUserInSession,
  updateSessionMenuTotalSoFar,
  updateSessionTipTotalSoFar,
  getSessionMenuTotalSoFar,
  getSessionTipTotalSoFar,
  updateUserMenuTotal,
  updateUserTipTotal,
  getMenuTotalByUser,
  getTipTotalByUser,
  getAllOrders
};

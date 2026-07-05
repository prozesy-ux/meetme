const Agency = require("../../models/agency.model");
const Admin = require("../../models/admin.model");

//generateAgencyCode
const generateAgencyCode = require("../../util/generateAgencyCode");

//Cryptr
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotallySecretKey");

//fs
const fs = require("fs");

//axios
const axios = require("axios");

//deletefile
const { deleteFile } = require("../../util/deletefile");

//private key
const firebaseAdminPromise = require("../../util/privateKey");

//create agency
function _0x1b42(_0x3a1a68, _0x1e663f) {
  const _0x4b89f4 = _0x4b89();
  return (
    (_0x1b42 = function (_0x1b4267, _0x3588bb) {
      _0x1b4267 = _0x1b4267 - 0x178;
      let _0x70d4b7 = _0x4b89f4[_0x1b4267];
      return _0x70d4b7;
    }),
    _0x1b42(_0x3a1a68, _0x1e663f)
  );
}
const _0x4e5193 = _0x1b42;
function _0x4b89() {
  const _0x252b31 = [
    "819860xrxSdA",
    "all",
    "log",
    "164758xraTfJ",
    "All\x20fields\x20are\x20required!",
    "encrypt",
    "save",
    "Failed\x20to\x20verify\x20purchase\x20code\x20with\x20Envato.",
    "deleteUser",
    "Only\x20one\x20agency\x20is\x20allowed\x20with\x20a\x20Regular\x20license.\x20Upgrade\x20to\x20an\x20Extended\x20license\x20to\x20add\x20more.",
    "data",
    "Bearer\x20G9o1R8snTfNCpRgMzzKmpQP9kOVbapnP",
    "18887418rRYBcE",
    "5035FHhFJt",
    "Internal\x20server\x20error.",
    "status",
    "toLowerCase",
    "1655681xuwabg",
    "11486384DRGhox",
    "Agency\x20created\x20successfully\x20under\x20a\x20valid\x20license!",
    "lean",
    "body",
    "createAgency\x20error:",
    "7937692faSnlV",
    "purchaseCode",
    "10jKcpnx",
    "path",
    "figgy",
    "select",
    "name",
    "file",
    "trim",
    "findOne",
    "message",
    "decrypt",
    "2238SwnBIr",
    "https://api.envato.com/v3/market/author/sale?code=",
    "password",
    "This\x20Envato\x20purchase\x20code\x20is\x20not\x20valid\x20for\x20the\x20Figgy\x20app.",
    "9ogZRvt",
    "Email\x20already\x20exists!",
    "json",
    "error",
    "createAgency",
    "countDocuments",
    "includes",
  ];
  _0x4b89 = function () {
    return _0x252b31;
  };
  return _0x4b89();
}
((function (_0x5dd941, _0x48ef45) {
  const _0x2498bf = _0x1b42,
    _0x147178 = _0x5dd941();
  while (!![]) {
    try {
      const _0x466ad4 =
        parseInt(_0x2498bf(0x17a)) / 0x1 +
        parseInt(_0x2498bf(0x19a)) / 0x2 +
        (parseInt(_0x2498bf(0x190)) / 0x3) * (parseInt(_0x2498bf(0x197)) / 0x4) +
        (parseInt(_0x2498bf(0x1a4)) / 0x5) * (parseInt(_0x2498bf(0x18c)) / 0x6) +
        -parseInt(_0x2498bf(0x180)) / 0x7 +
        parseInt(_0x2498bf(0x17b)) / 0x8 +
        (parseInt(_0x2498bf(0x1a3)) / 0x9) * (-parseInt(_0x2498bf(0x182)) / 0xa);
      if (_0x466ad4 === _0x48ef45) break;
      else _0x147178["push"](_0x147178["shift"]());
    } catch (_0x585dc6) {
      _0x147178["push"](_0x147178["shift"]());
    }
  }
})(_0x4b89, 0xe37de),
  (exports[_0x4e5193(0x194)] = async (_0x9c5c81, _0x47b71e) => {
    const _0x1a0b0b = _0x4e5193;
    try {
      const {
        name: _0x4f4cbf,
        email: _0x1d7785,
        commissionType: _0x6b3a21,
        commission: _0x2e01d7,
        password: _0x4e9990,
        countryCode: _0x38c238,
        mobileNumber: _0x4bbeb6,
        description: _0x55e192,
        countryFlagImage: _0x271936,
        country: _0xa9741b,
        uid: _0x14b823,
      } = _0x9c5c81[_0x1a0b0b(0x17e)];
      if (!_0x4f4cbf || !_0x1d7785 || !_0x6b3a21 || !_0x2e01d7 || !_0x4e9990 || !_0x38c238 || !_0x4bbeb6 || !_0x9c5c81[_0x1a0b0b(0x187)] || !_0x55e192 || !_0x271936 || !_0xa9741b || !_0x14b823) {
        if (_0x9c5c81[_0x1a0b0b(0x187)]) deleteFile(_0x9c5c81[_0x1a0b0b(0x187)][_0x1a0b0b(0x183)]);
        return _0x47b71e["status"](0xc8)["json"]({ status: ![], message: _0x1a0b0b(0x19b) });
      }
      const _0x3114c5 = await Admin[_0x1a0b0b(0x189)]()[_0x1a0b0b(0x185)](_0x1a0b0b(0x181))[_0x1a0b0b(0x17d)]();
      if (!_0x3114c5 || !_0x3114c5[_0x1a0b0b(0x181)]) {
        if (_0x9c5c81[_0x1a0b0b(0x187)]) deleteFile(_0x9c5c81["file"]["path"]);
        return _0x47b71e[_0x1a0b0b(0x178)](0xc8)["json"]({ status: ![], message: "Purchase\x20code\x20not\x20configured\x20by\x20admin." });
      }
      const _0x5b93c8 = _0x3114c5["purchaseCode"]["trim"]()["toLowerCase"](),
        _0xba0000 = _0x1a0b0b(0x18d) + _0x5b93c8,
        _0x195a3c = { Authorization: _0x1a0b0b(0x1a2) };
      let _0x2445e9;
      try {
        _0x2445e9 = await axios["get"](_0xba0000, { headers: _0x195a3c });
      } catch (_0x4dbf7e) {
        if (_0x9c5c81[_0x1a0b0b(0x187)]) deleteFile(_0x9c5c81[_0x1a0b0b(0x187)]["path"]);
        return _0x47b71e["status"](0xc8)[_0x1a0b0b(0x192)]({ status: ![], message: _0x1a0b0b(0x19e) });
      }
      const { item: _0x5d878c, license: _0x916333 } = _0x2445e9[_0x1a0b0b(0x1a1)];
      if (!_0x5d878c || !_0x5d878c[_0x1a0b0b(0x186)]["toLowerCase"]()[_0x1a0b0b(0x196)](_0x1a0b0b(0x184))) {
        if (_0x9c5c81[_0x1a0b0b(0x187)]) deleteFile(_0x9c5c81[_0x1a0b0b(0x187)][_0x1a0b0b(0x183)]);
        return _0x47b71e[_0x1a0b0b(0x178)](0xc8)[_0x1a0b0b(0x192)]({ status: ![], message: _0x1a0b0b(0x18f) });
      }
      if (_0x916333["trim"]() === "Regular\x20License") {
        const _0x1ce235 = await Agency[_0x1a0b0b(0x195)]();
        if (_0x1ce235 >= 0x1) {
          if (_0x9c5c81[_0x1a0b0b(0x187)]) deleteFile(_0x9c5c81[_0x1a0b0b(0x187)][_0x1a0b0b(0x183)]);
          if (_0x14b823)
            try {
              const _0x2a8102 = await firebaseAdminPromise;
              (_0x2a8102["auth"]()[_0x1a0b0b(0x19f)](_0x14b823), console[_0x1a0b0b(0x199)]("✅\x20Firebase\x20agency\x20deleted:\x20" + _0x14b823));
            } catch (_0x48aa10) {
              console[_0x1a0b0b(0x193)]("❌\x20Failed\x20to\x20delete\x20Firebase\x20agency\x20" + _0x14b823 + ":", _0x48aa10[_0x1a0b0b(0x18a)]);
            }
          return _0x47b71e[_0x1a0b0b(0x178)](0xc8)[_0x1a0b0b(0x192)]({ status: ![], message: _0x1a0b0b(0x1a0) });
        }
      }
      const [_0x3e2eac, _0x15fc58] = await Promise[_0x1a0b0b(0x198)]([
        Agency[_0x1a0b0b(0x189)]({ email: _0x1d7785["trim"](), uid: _0x14b823[_0x1a0b0b(0x188)]()[_0x1a0b0b(0x179)]() }),
        generateAgencyCode(),
      ]);
      if (_0x3e2eac) {
        if (_0x9c5c81[_0x1a0b0b(0x187)]) deleteFile(_0x9c5c81[_0x1a0b0b(0x187)][_0x1a0b0b(0x183)]);
        return _0x47b71e["status"](0xc8)[_0x1a0b0b(0x192)]({ status: ![], message: _0x1a0b0b(0x191) });
      }
      const _0x16693f = new Agency({
        uid: _0x14b823,
        agencyCode: _0x15fc58,
        name: _0x4f4cbf,
        email: _0x1d7785,
        commissionType: _0x6b3a21,
        commission: _0x2e01d7,
        password: cryptr[_0x1a0b0b(0x19c)](_0x4e9990),
        countryCode: _0x38c238,
        mobileNumber: _0x4bbeb6,
        image: _0x9c5c81["file"]["path"],
        description: _0x55e192,
        countryFlagImage: _0x271936,
        country: _0xa9741b,
      });
      return (
        await _0x16693f[_0x1a0b0b(0x19d)](),
        (_0x16693f[_0x1a0b0b(0x18e)] = cryptr[_0x1a0b0b(0x18b)](_0x16693f[_0x1a0b0b(0x18e)])),
        _0x47b71e["status"](0xc8)[_0x1a0b0b(0x192)]({ status: !![], message: _0x1a0b0b(0x17c), data: _0x16693f })
      );
    } catch (_0x440e3c) {
      console["error"](_0x1a0b0b(0x17f), _0x440e3c);
      if (_0x9c5c81[_0x1a0b0b(0x187)]) deleteFile(_0x9c5c81["file"]["path"]);
      return _0x47b71e[_0x1a0b0b(0x178)](0x1f4)[_0x1a0b0b(0x192)]({ status: ![], message: _0x1a0b0b(0x1a5) });
    }
  }));

//update agency
exports.updateAgency = async (req, res) => {
  try {
    const { agencyId } = req.query;
    const { name, email, commissionType, commission, password, countryCode, mobileNumber, description, countryFlagImage, country, uid } = req.body;

    if (!agencyId) {
      if (req.file) deleteFile(req.file);
      return res.status(200).json({ status: false, message: "Agency ID is required." });
    }

    const [existingAgency, agency] = await Promise.all([email ? Agency.findOne({ email: email.trim(), uid: uid?.trim?.() }) : null, Agency.findById(agencyId)]);

    if (email && existingAgency) {
      if (req.file) deleteFile(req.file);
      return res.status(200).json({ status: false, message: "Email already exists!" });
    }

    if (!agency) {
      if (req.file) deleteFile(req.file);
      return res.status(200).json({ status: false, message: "Agency not found." });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        if (req.file) deleteFile(req.file);
        return res.status(200).json({ status: false, message: "Invalid email format." });
      }
    }

    agency.uid = uid || agency.uid;
    agency.name = name || agency.name;
    agency.email = email?.trim() || agency.email;
    agency.password = password ? cryptr?.encrypt(password) : agency.password;
    agency.countryCode = countryCode || agency.countryCode;
    agency.mobileNumber = mobileNumber || agency.mobileNumber;
    agency.commissionType = commissionType || agency.commissionType;
    agency.commission = commission || agency.commission;
    agency.description = description || agency.description;
    agency.countryFlagImage = countryFlagImage || agency.countryFlagImage;
    agency.country = country || agency.country;

    if (req.file) {
      if (agency.image) {
        const imagePath = agency.image.includes("storage") ? "storage" + agency.image.split("storage")[1] : "";
        if (imagePath && fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      agency.image = req.file.path;
    }

    // try {
    //   if (agency.uid && (email || password)) {
    //     const firebaseAdmin = await firebaseAdminPromise;

    //     const payload = {};
    //     if (email) payload.email = email.trim();
    //     if (password) payload.password = password;

    //     await firebaseAdmin.auth().updateUser(String(agency.uid), payload);
    //   }
    // } catch (fbErr) {
    //   if (req.file) deleteFile(req.file);
    //   console.error("Firebase update error:", fbErr);
    //   return res.status(200).json({
    //     status: false,
    //     message: fbErr?.message || "Failed to update credentials in Firebase.",
    //   });
    // }

    await agency.save();

    agency.password = cryptr.decrypt(agency.password);

    return res.status(200).json({
      status: true,
      message: "Agency updated successfully!",
      data: agency,
    });
  } catch (error) {
    if (req.file) deleteFile(req.file);
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal server error." });
  }
};

//toggle agency block status
exports.toggleAgencyBlockStatus = async (req, res, next) => {
  try {
    const { agencyId } = req.query;

    if (!agencyId) {
      return res.status(200).json({ status: false, message: "Agency ID is required." });
    }

    const agency = await Agency.findById(agencyId);
    if (!agency) {
      return res.status(200).json({ status: false, message: "Agency not found." });
    }

    agency.isBlock = !agency.isBlock;
    await agency.save();

    return res.status(200).json({
      status: true,
      message: `Agency has been ${agency.isBlock ? "blocked" : "unblocked"} successfully.`,
      data: agency,
    });
  } catch (error) {
    console.error("Error updating agency block status:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while updating the agency's block status.",
    });
  }
};

//get agencies
exports.getAgencies = async (req, res) => {
  try {
    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const searchString = req.query.search || "";
    const startDate = req.query.startDate || "All";
    const endDate = req.query.endDate || "All";

    let matchQuery = {};

    if (startDate !== "All" && endDate !== "All") {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);

      matchQuery.createdAt = { $gte: startDateObj, $lte: endDateObj };
    }

    if (searchString !== "All" && searchString !== "") {
      matchQuery.$or = [{ name: { $regex: searchString, $options: "i" } }, { email: { $regex: searchString, $options: "i" } }, { agencyCode: { $regex: searchString, $options: "i" } }];
    }

    const [total, agencies] = await Promise.all([
      Agency.countDocuments(matchQuery),
      Agency.aggregate([
        { $match: matchQuery },
        {
          $lookup: {
            from: "hosts",
            let: { agencyId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$agencyId", "$$agencyId"] }, { $eq: ["$status", 2] }, { $eq: ["$isFake", false] }],
                  },
                },
              },
            ],
            as: "hosts",
          },
        },
        {
          $addFields: {
            totalHosts: { $size: "$hosts" },
          },
        },
        { $unset: "hosts" },
        {
          $project: {
            _id: 1,
            totalHosts: 1,
            name: 1,
            email: 1,
            description: 1,
            password: 1,
            commissionType: 1,
            commission: 1,
            agencyCode: 1,
            countryCode: 1,
            mobileNumber: 1,
            image: 1,
            countryFlagImage: 1,
            country: 1,
            hostCoins: 1,
            totalEarnings: 1,
            netAvailableEarnings: 1,
            isBlock: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: (start - 1) * limit },
        { $limit: limit },
      ]),
    ]);

    for (let i = 0; i < agencies.length; i++) {
      try {
        if (agencies[i].password && agencies[i].password.trim() !== "") {
          agencies[i].password = cryptr.decrypt(agencies[i].password);
        }
      } catch (err) {
        agencies[i].password = "Decryption Failed";
      }
    }

    return res.status(200).json({
      status: true,
      message: "Agencies retrieved successfully!",
      total: total,
      data: agencies,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal server error." });
  }
};

//delete agency
exports.deleteAgency = async (req, res) => {
  try {
    const { agencyId } = req.query;

    if (!agencyId) {
      return res.status(200).json({ status: false, message: "Agency ID is required." });
    }

    const agency = await Agency.findById(agencyId);
    if (!agency) {
      return res.status(200).json({ status: false, message: "Agency not found." });
    }

    await agency.deleteOne();

    return res.status(200).json({
      status: true,
      message: "Agency deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal server error." });
  }
};

//get agency list ( when assign host under agency )
exports.getActiveAgenciesList = async (req, res) => {
  try {
    const agencies = await Agency.find({ isBlock: false }).select("_id name agencyCode").lean();

    return res.status(200).json({
      status: true,
      message: "Active agencies retrieved successfully.",
      data: agencies,
    });
  } catch (error) {
    console.error("Error in getActiveAgenciesList:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

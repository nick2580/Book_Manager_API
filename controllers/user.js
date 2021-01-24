const User = require("../models/user");
// const { Order } = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "NO USER WAS FOUND",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update user",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

// exports.userPurchaseList = (req, res) => {
//   Order.find({ user: req.profile._id }, (err, order) => {
//     if (err) {
//       return res.status(400).json({
//         error: "No Order was found",
//       });
//     }
//     res.json(order);
//   });
// };

// exports.pushOrderInPurchaseList = (req, res, next) => {
//   let purchases = [];
//   //product in ForEach loop is the single product of Product Schema
//   req.body.order.products.forEach((product) => {
//     purchases.push({
//       _id: product._id,
//       name: product.name,
//       description: product.description,
//       category: product.category,
//       quantity: product.quantity,
//       amount: req.body.order.amount,
//       transaction_id: req.body.order.transaction_id,
//     });
//   });

//   //Store this in DB
//   User.findOneAndUpdate(
//     { _id: req.profile._id },
//     { $push: { purchases: purchases } }, //Update (DB Purchases):(With My Purchases)
//     { new: true },
//     (err, purchases) => {
//       if (err) {
//         return res.status(400).json({
//           error: "Unable to save purchase List",
//         });
//       }
//       next();
//     }
//   );
// };

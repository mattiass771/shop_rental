const mongoose = require("mongoose");
const router = require("express").Router();

const Schema = mongoose.Schema;

// SCHEMAS //

const shopItemSchema = {
  itemName: { type: String, required: true, default: "New Item" },
  price: { type: String, required: true, default: "Price" },
  description: {
    type: String,
    required: true,
    default: "Add a brief description to the new item..."
  },
  imageLink: {
    type: String,
    required: true,
    default: "https://loading.io/icon/jzph2f"
  },
  customColor: { type: String },
  sizes: {type: Array, default: []},
  colors: {type: Array, default: []}
};

const shopSchema = new Schema({
  shopName: { type: String, required: true, default: "New Shop" },
  owner: { type: String, required: true, default: "Who is the owner?" },
  ownerId: { type: String, required: true, default: "no_id" },
  description: {
    type: String,
    required: true,
    default: "Add a brief description to your shop..."
  },
  url: {type: String, required: true},
  shopItems: [shopItemSchema],
  shopPref: {
    jumboColor: { type: String, required: true, default: "#c1c1c1" },
    jumboTextColor: { type: String, required: true, default: "#333333" },
    pageColor: { type: String, required: true, default: "whitesmoke" },
    itemColor: { type: String, required: true, default: "#c1c1c1" }
  }
});

const Shop = mongoose.model("Shop", shopSchema);
const ShopItem = mongoose.model("ShopItem", shopItemSchema);

// ROUTES //

router.route("/").get((req, res) => {
  Shop.find()
    .then((shops) => res.json(shops))
    .catch((err) => res.status(400).json(`Error: ${err} !`));
});

router.route("/:shopId").get((req, res) => {
  Shop.findById(req.params.shopId)
    .then((shop) => res.json(shop))
    .catch((err) => res.status(400).json(`Error: ${err} !`));
});

router.route("/owner/:userId").get((req, res) => {
  const userId = req.params.userId;
  Shop.findOne({ ownerId: userId })
    .then((shop) => res.json(shop))
    .catch((err) => res.status.apply(400).json(`Error: ${err} !`));
});

router.route("/link/:link").get((req, res) => {
  const link = req.params.link;
  Shop.findOne({ url: link })
    .then((shop) => res.json(shop))
    .catch((err) => res.status.apply(400).json(`Error: ${err} !`));
});

router.route("/add").post((req, res) => {
  const { shopName, owner, ownerId, description, url } = req.body;

  const addShop = new Shop({
    shopName,
    owner,
    ownerId,
    description,
    url
  });
  addShop
    .save()
    .then(() => res.json(`Your shop is now online!`))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// REPLACE ATTRIBUTE WITH INPUT FOR SHOP
router.route("/:shopId/update-shop/:find/:replace").put((req, res) => {
  const { shopId, find, replace } = req.params;

  const newValue = replace.replace(/_/g, " ");

  Shop.findById(shopId, (err, shopFound) => {
    if (err) return console.log(err.data);
    shopFound[find] = newValue;

    shopFound
      .save()
      .then(() => res.json(`Shop updated!`))
      .catch((error) => res.status(400).json(`Error: ${error}`));
  });
});

// REPLACE ATTRIBUTE WITH INPUT FOR SHOP-ITEMS
router.route("/:shopId/update-item/:itemId/:find/:replace").put((req, res) => {
  const { shopId, find, replace, itemId } = req.params;

  const newValue = replace.replace(/_/g, " ");

  Shop.findById(shopId, (err, shopFound) => {
    if (err) return console.log(err.data);
    shopFound.shopItems.find((val) => val._id.toString() === itemId)[
      find
    ] = newValue;

    shopFound
      .save()
      .then(() => res.json(`Item updated!`))
      .catch((error) => res.status(400).json(`Error: ${error}`));
  });
});

// REPLACE ATTRIBUTE WITH INPUT FOR SHOP-PREFS
router.route("/:shopId/update-pref/:find/:replace").put((req, res) => {
  const { shopId, find, replace } = req.params;

  const newColor = replace.replace("_", "#");

  Shop.findById(shopId, (err, shopFound) => {
    if (err) return console.log(err.data);
    shopFound.shopPref[find] = newColor;

    shopFound
      .save()
      .then(() => res.json(`Item updated!`))
      .catch((error) => res.status(400).json(`Error: ${error}`));
  });
});

// REPLACE ATTRIBUTE WITH INPUT FOR SHOP-ITEMS
router.route("/:shopId/update-item/:itemId/:find/:replace").put((req, res) => {
  const { shopId, find, replace, itemId } = req.params;

  const newValue = replace.replace(/_/g, " ");

  Shop.findById(shopId, (err, shopFound) => {
    if (err) return console.log(err.data);
    shopFound.shopItems.find((val) => val._id.toString() === itemId)[
      find
    ] = newValue;

    shopFound
      .save()
      .then(() => res.json(`Item updated!`))
      .catch((error) => res.status(400).json(`Error: ${error}`));
  });
});

router.route("/:shopId/add-item").post((req, res) => {
  const { itemName, price, description, imageLink, sizes, colors } = req.body;

  const addShopItem = new ShopItem({
    itemName,
    price,
    description,
    imageLink,
    sizes,
    colors
  });

  Shop.findById(req.params.shopId, (err, shopFound) => {
    if (err) return console.log(err);
    shopFound.shopItems = [...shopFound.shopItems, addShopItem];

    shopFound
      .save()
      .then(() => res.json(`Item: ${itemName} added to your shop!`))
      .catch((err) => res.status(400).json(`Error: ${err}`));
  });
});

router.route("/:id").delete((req, res) => {
  Shop.findByIdAndDelete(req.params.id)
    .then(() => res.json("Shop deleted."))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

//TODO: FIND AND DELETE ITEM
router.route("/:shopId/delete-item/:itemId").post((req, res) => {
  Shop.findById(req.params.shopId, (err, shopFound) => {
    if (err) return console.log(err.data);

    const removedItem = shopFound.shopItems.find(
      (val) => val._id.toString() === req.params.itemId
    );

    shopFound.shopItems = shopFound.shopItems.filter(
      (val) => val._id.toString() !== req.params.itemId
    );
    shopFound
      .save()
      .then(() =>
        res.json(`Item: ${removedItem.itemName} was removed from your shop.`)
      );
  });
});

module.exports = {
  router,
  Shop
};

const { faker } = require("@faker-js/faker");

const catchAsync = require("../utils/catchAsync");
const Item = require("../model/itemModel");
const uploadImage = require("./uploadImage");

exports.uploadItem = catchAsync(async (req, res, next) => {
  const item = {
    name: req.body.itemName,
    categories: [...req.body.categories.split(".")],
    discount: faker.commerce.price({ min: 5, max: 50 }),
    price: faker.commerce.price({ min: 20, max: 100 }),
    description: `
          ${faker.commerce.productDescription()} ${faker.commerce.productDescription()}
          ${faker.commerce.productDescription()} ${faker.commerce.productDescription()}
          ${faker.commerce.productDescription()} ${faker.commerce.productDescription()}
          ${faker.commerce.productDescription()} ${faker.commerce.productDescription()}
          ${faker.commerce.productDescription()} ${faker.commerce.productDescription()}
          ${faker.commerce.productDescription()} ${faker.commerce.productDescription()}
          ${faker.commerce.productDescription()} ${faker.commerce.productDescription()}
          ${faker.commerce.productDescription()} ${faker.commerce.productDescription()}
          ${faker.commerce.productDescription()}`,
    specifications: {
      features: [
        faker.commerce.productAdjective(),
        faker.commerce.productAdjective(),
        faker.commerce.productAdjective(),
        faker.commerce.productAdjective(),
      ],
      specs: {
        weight: faker.number.int({ min: 50, max: 100 }),
        barcode: Math.ceil(Math.random() * 1000000),
        color: faker.color.human(),
        origin: faker.location.country(),
        material: "glass",
      },
    },
    stock: faker.number.int({ min: 50, max: 500 }),
  };

  // upload images to cloudinary and include in item object
  const imageResult = await Promise.all(
    req.files
      .sort((a, b) => a.originalname.localeCompare(b.originalname))
      .map((file) => uploadImage(file.buffer)),
  );

  item.photo = imageResult[imageResult.length - 1];
  item.images = [...imageResult.slice(0, imageResult.length)];

  const data = await Item.create(item);

  res.status(200).json({
    message: "success",
    data,
  });
});

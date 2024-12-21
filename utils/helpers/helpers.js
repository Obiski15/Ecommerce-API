exports.calculateDeliveryFee = (quantity, weight) =>
  +(quantity * weight * 0.03).toFixed(2);

exports.calculateFinalPrice = (actualPrice, deliveryFee, discount) =>
  actualPrice + deliveryFee - discount;

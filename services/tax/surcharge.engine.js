function applySurcharge(income, tax, regime) {

    let rate = 0;

    if (income > 5000000 && income <= 10000000)
        rate = 0.10;
    else if (income > 10000000 && income <= 20000000)
        rate = 0.15;
    else if (income > 20000000 && income <= 50000000)
        rate = 0.25;
    else if (income > 50000000)
        rate = regime === "new" ? 0.25 : 0.37; // cap for new regime

    return tax + (tax * rate);
}

module.exports = { applySurcharge };

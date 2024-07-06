require("express-async-errors")
const express = require("express");
const app = express();
const axios = require("axios");
const PORT = process.env.PORT || 3000
const apiKeyBase64 = 'UFo3OC1QS0xJVkUtNjIwMENFQUItRkVDRi00NzEzLTk0N0EtM0U2RDAyQTI4RUM1'
const lowFeeApiKey = "PZ78-PKLIVE-0E3EEBF6-B58B-4DD2-9C78-99D1E61945F8"



app.get('/createVirtualAccount', async (req, res) => {

    let payload = JSON.stringify({
        "service_type": "Account",
        "service_payload": {
            "request_application": "Payaza",
            "application_module": "USER_MODULE",
            "application_version": "1.0.0",
            "request_class": "MerchantCreateVirtualAccount",
            "customer_first_name": "Malachi Rhines",
            "customer_last_name": "Malachi Fisher",
            "customer_email": "LinesFisher@gmail.com",
            "customer_phone": "09012345673",
            "virtual_account_provider": "Premiumtrust",
            "payment_amount": 102,
            "payment_reference": "RCO1322XLINng"
        }
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://router-live.78financials.com/api/request/secure/payloadhandler',
        headers: {
            'Authorization': `Payaza ${apiKeyBase64}`,
            'Content-Type': 'application/json'
        },
        data: payload
    };

    const { data } = await axios.request(config)
    console.log(data)
    res.status(200).json({ virtualAccountDetails: data })
})

app.get("/makeTransfer/:acc_num/:acc_name/:amount", async (req, res) => {
    let { acc_num, acc_name, amount } = req.params

    let payload = JSON.stringify({
        "transaction_type": "nuban",
        "service_payload": {
            "payout_amount": 100,
            "transaction_pin": 1429,
            "account_reference": "1010000009",
            "currency": "NGN",
            "payout_beneficiaries": [
                {
                    "credit_amount": Number(amount),
                    "account_number": `${acc_num}`,
                    "account_name": `${acc_name}`,
                    "bank_code": "000013",
                    "narration": "Test",
                    "transaction_reference": "TD93001234",
                    "sender": {
                        "sender_name": "Jane Doe",
                        "sender_id": "",
                        "sender_phone_number": "01234595",
                        "sender_address": "123, Ace Street"
                    }
                }
            ]
        }
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.payaza.africa/live/payout-receptor/payout',
        headers: {
            'Authorization': `Payaza ${apiKeyBase64}`,
            'X-TenantID': 'test',
            'Content-Type': 'application/json'
        },
        data: payload
    };

    const { data } = await axios.request(config)
    res.status(200).json({ data })
})


app.use((err, req, res, next) => {
    res.status(500).json({ status: false, error: err.message })
})

app.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`)
})

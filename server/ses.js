const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1",
});

module.exports.sendEmail = function (recipient, name, code) {
    return ses.sendEmail(
        {
            Source: "This Network <opposite.enquiry@spicedling.email>",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `Reset your password with this Code: ${code}`,
                    },
                },
                Subject: {
                    Data: `Hey, ${name}, you want to reset your password?`,
                },
            },
        }
            .promise()
            .then(() => console.log("it worked!"))
            .catch((err) => console.log(err))
    );
};

const templates = {
  default: (name) => {
    return `module.exports.${name} = async (event) => {
	return {
		statusCode: 200,
		body: JSON.stringify(
			{
				message: "Go Serverless v2.0! Your function executed successfully!",
				input: event,
			},
			null,
			2
		),
	};
};
		  `;
  },

  otherTemplate: (name) => {
    return `module.exports.${name} = async (event) => {
	return {
		statusCode: 404,
	};
};
		`;
  },
};

export default templates;


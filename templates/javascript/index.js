/**
 * Generates a handler function.
 *
 * @param funcName
 * The name of the function.
 *
 * @returns
 * A string contains the function.
 */

export const generateHandler = (funcName) => {
  return (
    `'use strict'` +
    `\n\n` +
    `module.exports.${funcName} = async (event) => {
  return {
	statusCode: 200,
	body: JSON.stringify(
	  {
		message: 'Go Serverless v2.0! Your function executed successfully!',
		input: event,
	  },
	  null,
	  2
	),
  };
};`
  );
};

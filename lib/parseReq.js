const processContents = (req) => {
  const reqContent = {};
  reqContent.headers = req.headers;
  reqContent.body = JSON.stringify(req.body)
  reqContent.method = req.method;
  reqContent.time = (new Date()).toString();
  return reqContent;
};

module.exports = processContents;
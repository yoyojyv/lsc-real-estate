class AsyncRequest {
  asyncRequest(asyncFn, req, res) {
    asyncFn(req, res)
      .catch(e => {
        res.status(500).json({ message: e.message });
      });
  }
}

module.exports = new AsyncRequest();

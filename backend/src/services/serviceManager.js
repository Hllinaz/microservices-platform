function validateTransition(currentStatus, newStatus) {

  const allowedTransitions = {
    created: ["running", "removed"],
    running: ["stopped"],
    stopped: ["running", "removed"],
    removed: []
  };

  if (!allowedTransitions[currentStatus].includes(newStatus)) {
    throw new Error(
      `Invalid transition from ${currentStatus} to ${newStatus}`
    );
  }
}

module.exports = {
  validateTransition
};
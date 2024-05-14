// Function to update bot status
function updateBotStatus(client, isOnline) {
  const activityData = {
    name: isOnline ? 'I see you' : 'your game/activity',
    type: 'WATCHING',
  };

  console.log(`Updating bot activity`);

  client.user.setActivity(activityData);
}

module.exports = {
  updateBotStatus,
};
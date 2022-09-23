export const rollDice = (list) => {
  const winnerIndex = Math.floor(Math.random() * list.length);
  const winnerId = list[winnerIndex];
  const remainedList = list.filter((id) => id !== winnerId);

  return { winID: winnerId, currList: remainedList };
};

export const chooseWithCommentCondition = (competitors) => {
  const userMap = new Map();

  competitors.forEach((x) => {
    if (userMap.has(x.uid)) {
      userMap.get(x.uid).add(x.text);
    } else {
      let newSet = new Set();
      newSet.add(x.text);
      userMap.set(x.uid, newSet);
    }
  });
  let userArr = [];
  userMap.forEach((value, key) => {
    userArr = [...userArr, ...Array(value.size).fill(key)];
  });

  return userArr;
};

export const chooseWithUserCondition = (competitors) => {
  const userSet = new Set(competitors.slice().map((info) => info.uid));
  const uniqueUsers = Array.from(userSet);
  return uniqueUsers;
};

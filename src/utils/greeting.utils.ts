export const GetGreetingUtils = (): string => {
  const date = new Date();
  const hours = date.getHours();

  if (hours < 12) {
    return "Bonjour";
  } else if (hours < 17) {
    return "Bon après-midi";
  } else {
    return "Bonsoir";
  }
};

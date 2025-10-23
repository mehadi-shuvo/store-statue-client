export const getTopUpData = async () => {
  const res = await fetch("/data/topup-data.json");
  const data = await res.json();
  return data;
};

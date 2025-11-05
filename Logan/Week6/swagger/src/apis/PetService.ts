export const getSinglePet = async (id: number): Promise<any> => {
  const response = await fetch(`https://petstore3.swagger.io/api/v3/pet/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch pet");
  }

  const data = await response.json();

  return data;
};

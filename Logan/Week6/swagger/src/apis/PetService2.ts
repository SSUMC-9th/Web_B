// request params가 여러개일때, name과 status는 request에 포함될수도 안될수도있다.

interface ApiRequest {
  petId: number;
  name?: string;
  status?: string;
}

export const api = async ({ petId, name, status }: ApiRequest) => {
  const url = new URL(`pet/${petId}`);

  if (status) {
    url.searchParams.set("status", status); // set기능뭐지
  }
  if (name) {
    url.searchParams.set("name", name);
  }
  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch pet");
  }

  const data = await response.json();
  return data;
};

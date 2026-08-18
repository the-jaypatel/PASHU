const API_BASE_URL = "http://127.0.0.1:8000";

export async function predictBreed(file) {
  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch(
    `${API_BASE_URL}/api/predict`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Server error: ${response.status}`
    );
  }

  return await response.json();
}

export async function checkHealth() {
  const response = await fetch(
    `${API_BASE_URL}/api/health`
  );

  if (!response.ok) {
    throw new Error("Backend is not available");
  }

  return await response.json();
}
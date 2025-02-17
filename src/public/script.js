document.getElementById("fetchRecords").addEventListener("click", async () => {
  const output = document.getElementById("output");
  output.textContent = "Fetching records...";

  try {
    const res = await fetch("/api/records");
    const data = await res.json();

    output.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    output.textContent = `Error fetching records: ${error.message}`;
  }
});

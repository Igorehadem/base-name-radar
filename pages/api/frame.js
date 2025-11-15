export default async function handler(req, res) {
  if (req.method === "GET") {
    const payload = {
      version: "vNext",
      image: "https://igoreha.online/api/og?state=start",
      inputText: "yourname",
      buttons: [
        { label: "Check name", action: "post" }
      ]
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(JSON.stringify(payload));
    return;
  }

  if (req.method === "POST") {
    let body = await new Promise((resolve) => {
      let data = "";
      req.on("data", (chunk) => (data += chunk));
      req.on("end", () => resolve(JSON.parse(data || "{}")));
    });

    const name = (body?.untrustedData?.inputText || "").trim().toLowerCase();

    const payload = {
      version: "vNext",
      image: `https://igoreha.online/api/og?state=result&name=${name}`,
      buttons: [
        {
          label: "Open in Radar",
          action: "link",
          target: `https://igoreha.online/check?name=${name}`
        },
        { label: "Check another", action: "post" }
      ]
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(JSON.stringify(payload));
  }
}

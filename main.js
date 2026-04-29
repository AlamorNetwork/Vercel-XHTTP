const TARGET_DOMAIN = Deno.env.get("TARGET_DOMAIN");

Deno.serve(async (req) => {
  if (!TARGET_DOMAIN) {
    return new Response("TARGET_DOMAIN variable is missing", { status: 500 });
  }

  const url = new URL(req.url);
  const targetUrl = new URL(url.pathname + url.search, TARGET_DOMAIN);

  // کپی کردن هدرهای درخواست کاربر
  const headers = new Headers(req.headers);
  headers.set("Host", targetUrl.host); // تغییر هاست به سرور مقصد

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.body,
      redirect: "manual"
    });

    // برگرداندن پاسخ سرور مقصد به کاربر
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });

  } catch (err) {
    return new Response("Error connecting to destination", { status: 502 });
  }
});

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, apiKey: clientApiKey, appUrl: clientAppUrl, walletAddress, walletAddresses, title, message, targetPath, notificationEnabled } = body;

    const apiKey = clientApiKey || process.env.BASE_DASHBOARD_API_KEY || "";
    const appUrl = clientAppUrl || process.env.APP_URL || process.env.NEXT_PUBLIC_URL || "https://brc20-base-explorer.vercel.app";

    // Action 1: Check single user status
    if (action === "user_status") {
      if (!walletAddress) {
        return NextResponse.json({ error: "wallet_address is required" }, { status: 400 });
      }

      if (!apiKey) {
        // Return simulated status if no API key is provided
        return NextResponse.json({
          simulated: true,
          appPinned: true,
          notificationsEnabled: true,
          message: "No Base Dashboard API Key configured. Returned simulated status."
        });
      }

      const res = await fetch("https://dashboard.base.org/api/v1/notifications/app/user/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        body: JSON.stringify({
          app_url: appUrl,
          wallet_address: walletAddress
        })
      });

      const data = await res.json().catch(() => ({ error: "Invalid response format from remote server" }));
      return NextResponse.json(data, { status: res.status });
    }

    // Action 2: Get audience list
    if (action === "get_users") {
      if (!apiKey) {
        // Return simulated user list
        return NextResponse.json({
          simulated: true,
          success: true,
          users: [
            { address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", notificationsEnabled: true },
            { address: "0x3C44CdD47a357F965314867112B32ce823A66161", notificationsEnabled: true },
            { address: "0x8626f69A1617d54030B6113B59727909Ce408b03", notificationsEnabled: true },
            { address: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0", notificationsEnabled: true },
            { address: "0x8626f69A1617d54030B6113B59727909Ce408b03", notificationsEnabled: false }
          ],
          message: "No Base Dashboard API Key configured. Returned simulated audience list."
        });
      }

      const url = new URL("https://dashboard.base.org/api/v1/notifications/app/users");
      url.searchParams.set("app_url", appUrl);
      if (typeof notificationEnabled === "boolean") {
        url.searchParams.set("notification_enabled", String(notificationEnabled));
      }

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "x-api-key": apiKey
        }
      });

      const data = await res.json().catch(() => ({ error: "Invalid response format from remote server" }));
      return NextResponse.json(data, { status: res.status });
    }

    // Action 3: Send notification
    if (action === "send_notification") {
      if (!title || !message) {
        return NextResponse.json({ error: "title and message are required" }, { status: 400 });
      }

      const addresses = Array.isArray(walletAddresses) && walletAddresses.length > 0
        ? walletAddresses
        : ["0x71C7656EC7ab88b098defB751B7401B5f6d8976F"];

      if (!apiKey) {
        // Simulated success delivery
        return NextResponse.json({
          simulated: true,
          success: true,
          sentCount: addresses.length,
          failedCount: 0,
          results: addresses.map((addr: string) => ({
            walletAddress: addr,
            sent: true
          })),
          message: "Simulated notification sent via Base Dashboard Notifications API!"
        });
      }

      const payload: Record<string, unknown> = {
        app_url: appUrl,
        wallet_addresses: addresses,
        title: title.slice(0, 30),
        message: message.slice(0, 200)
      };

      if (targetPath) {
        payload.target_path = targetPath.startsWith("/") ? targetPath : `/${targetPath}`;
      }

      const res = await fetch("https://dashboard.base.org/api/v1/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({ error: "Invalid response format from remote server" }));
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

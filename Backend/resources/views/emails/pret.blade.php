<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background-color:#f4f4f4;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:20px;">
        <tr>
            <td align="center">

                <!-- Conteneur principal -->
                <table width="600" cellpadding="0" cellspacing="0" border="0"
                    style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="background:#4CAF50; padding:20px; text-align:center;">
                            <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:bold;">
                                {{ $data['title'] }}
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:20px; color:#333333; font-size:16px; line-height:1.5;">
                            <p style="margin:0 0 15px 0;">
                                {!! $data['body'] !!}
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#f4f4f4; text-align:center; padding:15px; font-size:12px; color:#777777;">
                            © 2025 Mon Application - Tous droits réservés
                        </td>
                    </tr>
                </table>
                <!-- Fin conteneur -->

            </td>
        </tr>
    </table>

</body>

</html>
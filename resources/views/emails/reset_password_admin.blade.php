<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تغير كلمة المرور</title>
    <style>
        body,
        table,
        td,
        a {
            text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        body {
            margin: 0;
            padding: 0;
            width: 100%;
        }

        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f7;
        }

        .content {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 8px;
        }

        h1 {
            font-size: 24px;
            color: #333333;
            margin-bottom: 20px;
        }

        p {
            font-size: 16px;
            color: #555555;
            margin-bottom: 20px;
            line-height: 1.5;
        }

        a {
            color: #1a82e2;
            text-decoration: none;
        }

        .button {
            display: inline-block;
            padding: 12px 24px;
            font-size: 16px;
            color: #ffffff;
            background-color: #1a82e2;
            border-radius: 4px;
            text-align: center;
            text-decoration: none;
        }

        .footer {
            font-size: 14px;
            color: #999999;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div dir="rtl" class="content">
            <!-- Logo -->
            {{-- @if($websiteLogo)
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="{{ $websiteLogo }}" alt="{{ $websiteName }}" style="max-height: 60px;">

            </div>
            @endif --}}
            <div style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
                <h1>{{ $websiteName }}</h1>
            </div>

            <!-- Main Content -->
            <strong><h3>طلب تغير كملة مرور من مستخدم</h3></strong>
            <p>مرحبًا {{ $admin->name }},</p>
            <p dir="rtl"> لقد تلقينا طلبًا لإعادة تعيين كلمة المرور , للمتسخدم {{ $user->name }}</p>
            <p>في حالة اردت تغيرها.</p>
            <p><a href="{{ $url }}" class="button">إعادة تعيين كلمة المرور</a></p>

            <!-- Footer Contact Information -->
            <div dir="rtl" class="footer">
                <p dir="rtl">شكرًا لك،<br>{{ $websiteName }}</p>
                <p dir="rtl">اتصل بنا</p>
                <p dir="rtl">هاتف : <span dir="ltr">{{ $phone }}</span></p>
                <p dir="rtl">بريد الاكتروني : <a href="mailto:{{ $email }}">{{ $email }}</a></p>
            </div>
        </div>
    </div>
</body>

</html>

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description"
            content="نظام شِب ماستر: الحل السحابي الأمثل لتتبع وإدارة شحن السيارات من المزادات الأمريكية. مع ميزات متقدمة مثل لوحة تحكم مخصصة، إدارة مالية، وتحديد نوع السيارة تلقائيًا. انضم إلينا لتجربة غير مسبوقة في متابعة الشحنات!">

        <meta name="keywords"
            content="شحن سيارات, نظام شحن سحابي, تتبع شحنات, إدارة شحن السيارات, مزادات أمريكية, شحن سيارات من المزادات, منصة شحن, شحن السيارات عبر الإنترنت, معلومات الشحن, متابعة الشحنات">

        <title inertia>ShipMaster: {{ $page['props']['site_settings']['websiteName'] }}</title>
<title>ShipMaster: (اسم الشركة)</title>
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="antialiased font-tajawal">
        @inertia
    </body>
</html>

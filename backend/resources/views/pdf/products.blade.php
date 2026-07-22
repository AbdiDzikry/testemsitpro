<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Data Produk</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #334155;
            font-size: 12px;
            margin: 0;
            padding: 0;
        }
        .kop-surat {
            border-bottom: 3px solid #f97316;
            padding-bottom: 20px;
            margin-bottom: 25px;
            text-align: center;
        }
        .kop-surat h1 {
            color: #f97316;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .kop-surat p {
            color: #64748b;
            font-size: 11px;
            margin: 5px 0 0 0;
        }
        .title {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        .info-table {
            width: 100%;
            margin-bottom: 20px;
        }
        .info-table td {
            font-size: 11px;
            color: #475569;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        table.data-table th, table.data-table td {
            border: 1px solid #e2e8f0;
            padding: 10px;
            text-align: left;
        }
        table.data-table th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
        }
        table.data-table td {
            font-size: 11px;
            color: #334155;
        }
        table.data-table tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .footer {
            margin-top: 50px;
            text-align: right;
            font-size: 11px;
            color: #64748b;
        }
        .signature-box {
            float: right;
            text-align: center;
            width: 200px;
            margin-top: 30px;
        }
        .signature-box .name {
            margin-top: 60px;
            font-weight: bold;
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <div class="kop-surat">
        <h1>EMSITPRO</h1>
        <p>Gedung Perkantoran Emsitpro Lt. 5, Jl. Jend. Sudirman No. 123, Jakarta Selatan</p>
        <p>Telp: (021) 555-0198 | Email: admin@emsitpro.com | Web: www.emsitpro.com</p>
    </div>

    <div class="title">Laporan Data Produk Inventory</div>

    <table class="info-table">
        <tr>
            <td width="100"><strong>Tanggal Cetak</strong></td>
            <td width="10">:</td>
            <td>{{ date('d F Y H:i') }}</td>
        </tr>
        <tr>
            <td><strong>Dicetak Oleh</strong></td>
            <td>:</td>
            <td>Administrator</td>
        </tr>
        <tr>
            <td><strong>Total Produk</strong></td>
            <td>:</td>
            <td>{{ count($products) }} Item</td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th width="30">No</th>
                <th>Nama Produk</th>
                <th width="120">Kategori</th>
                <th width="50" style="text-align: right">Stok</th>
                <th width="90" style="text-align: right">Harga (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($products as $index => $product)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $product->name }}</td>
                <td>{{ $product->category ? $product->category->name : '-' }}</td>
                <td style="text-align: right">{{ $product->stock }}</td>
                <td style="text-align: right">{{ number_format($product->price, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="signature-box">
        <div>Jakarta, {{ date('d F Y') }}</div>
        <div>Mengetahui,</div>
        <div class="name">Manager Operasional</div>
    </div>

</body>
</html>

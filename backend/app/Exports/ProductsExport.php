<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProductsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    public function collection()
    {
        return Product::with('category')->get();
    }

    public function headings(): array
    {
        return [
            ['LAPORAN DATA PRODUK EMSITPRO'],
            [''],
            ['ID', 'Nama Produk', 'Kategori', 'Stok', 'Harga']
        ];
    }

    public function map($product): array
    {
        return [
            $product->id,
            $product->name,
            $product->category->name ?? '-',
            $product->stock,
            $product->price,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Merge cells untuk judul
        $sheet->mergeCells('A1:E1');
        
        $highestRow = $sheet->getHighestRow();
        
        // Menambahkan border pada tabel
        $sheet->getStyle('A3:E'.$highestRow)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['argb' => 'FFCBD5E1'], // Tailwind Slate-300
                ],
            ],
        ]);

        return [
            // Styling Judul
            1 => [
                'font' => ['bold' => true, 'size' => 14, 'color' => ['argb' => 'FF1E293B']], // Slate-800
                'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER],
            ],
            // Styling Header Tabel
            3 => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FFF97316'] // Tailwind Orange-500
                ],
            ],
        ];
    }
}

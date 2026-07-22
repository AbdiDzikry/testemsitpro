# Petunjuk Tes Praktik Junior Programmer

## Panduan Tes #1

- Clone repository ini ke perangkat Anda
- Buat branch baru sesuai dengan nama akun github Anda, misal branch: junipro
- Commit dan push ke repository ini, sesuai dengan branch Anda masing-masing, dalam rentang waktu pukul **20.00 WIB s.d. 20.30 WIB** pada hari **Rabu, 22/07/2026** (satu hari setelah Interview HR)
- Jika Anda melakukan push ke repository sebelum pukul **20.00 WIB**, maka nilai akan dikurangi **10 poin**.
- Jika Anda melakukan push ke repository setelah pukul **20.30 WIB**, maka nilai akan dikurangi **20 poin**.

## Panduan Tes #2

- Buat aplikasi web fullstack dengan teknologi:
  - Backend: Laravel v11
  - Frontend: NextJS v15
  - CSS: Tailwind CSS v3
  - Database: MySQL v8
- Fitur aplikasi web terdiri dari:
  - Login & Logout
  - Halaman Dashboard: minimal terdiri dari 1 pie/bar chart
  - Halaman Product (kolom dan isi data bebas), terdiri dari:
    - **Relasi ke Category** (1 Category memiliki banyak Product)
    - Datagrid/Datatable server side (tampilkan nama Category via JOIN)
    - Fitur CRUD data (form menyediakan pilihan Category)
    - Fitur Filter data (termasuk filter by Category)
    - Fitur Sorting data
    - Fitur Pagination (server side)
    - Fitur Export data ke Excel

### Struktur Data Minimal

| Tabel        | Kolom                                                  |
| ------------ | ------------------------------------------------------ |
| `categories` | `id`, `name`                                           |
| `products`   | `id`, `name`, `category_id` (FK), `stock`, harga, dst. |

## Panduan Tes #3

- Rekam simulasi hasil pekerjaan Anda untuk semua fitur diatas, ke dalam video format .mp4 dan nama file akun github Anda (misal: junipro.mp4)
- Unggah video ke alamat berikut: https://drive.google.com/drive/folders/1DtQ-KchZmPY0s9sq2Chvcj0KexlFTgyI?usp=sharing
- Batas waktu unggah video, sesuai dengan waktu push repository pada Panduan Tes #1.

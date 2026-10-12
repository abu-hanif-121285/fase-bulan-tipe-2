// ============================================================
// MISI TATA SURYA — data materi (5 bab) dan kuis (20 soal)
// ============================================================

export interface BabSection {
  heading: string;
  paragraphs: string[];
}

export interface Bab {
  id: number;
  title: string;
  subtitle: string;
  sections: BabSection[];
  keyPoints: string[];
  reflection: string[];
  table?: { headers: string[]; rows: string[][] };
}

export const BAB: Bab[] = [
  {
    id: 1,
    title: 'Mengenal Matahari, Bumi, dan Bulan',
    subtitle: 'Tiga benda langit yang saling terkait',
    sections: [
      {
        heading: 'Tiga Benda Langit Kita',
        paragraphs: [
          'Matahari adalah sebuah bintang yang memancarkan cahaya dan energi sendiri. Matahari merupakan sumber cahaya dan energi utama bagi tata surya kita.',
          'Bumi adalah planet tempat kita hidup. Bumi mengelilingi Matahari dan berputar pada porosnya sendiri.',
          'Bulan adalah satelit alami Bumi. Bulan mengelilingi Bumi dan merupakan benda langit yang paling dekat dengan kita.',
        ],
      },
      {
        heading: 'Bulan Tidak Bercahaya Sendiri',
        paragraphs: [
          'Bulan tidak menghasilkan cahaya sendiri. Cahaya yang kita lihat dari Bulan sebenarnya adalah cahaya Matahari yang dipantulkan oleh permukaan Bulan.',
          'Karena itulah, bagian Bulan yang menghadap Matahari tampak terang, sedangkan bagian yang membelakangi Matahari tampak gelap.',
        ],
      },
      {
        heading: 'Hubungan Posisi Tiga Benda Langit',
        paragraphs: [
          'Posisi Matahari, Bumi, dan Bulan saling memengaruhi. Hubungan posisi ketiganya membantu kita memahami beberapa fenomena, antara lain pergantian siang dan malam, perubahan fase Bulan, serta gerhana.',
          'Dengan memahami hubungan posisi ketiga benda langit ini, kita dapat menjelaskan banyak peristiwa yang kita amati di langit.',
        ],
      },
    ],
    keyPoints: [
      'Matahari adalah bintang yang memancarkan cahaya dan energi sendiri.',
      'Bumi adalah planet tempat kita hidup yang mengelilingi Matahari.',
      'Bulan adalah satelit alami Bumi yang mengelilingi Bumi.',
      'Bulan tidak menghasilkan cahaya sendiri; ia memantulkan cahaya Matahari.',
      'Hubungan posisi Matahari, Bumi, dan Bulan menjelaskan siang-malam, fase Bulan, dan gerhana.',
    ],
    reflection: [
      'Apa perbedaan Matahari dan Bulan dalam hal cahaya?',
      'Mengapa Bulan bisa tampak bercahaya padahal tidak menghasilkan cahaya sendiri?',
    ],
  },
  {
    id: 2,
    title: 'Rotasi dan Revolusi',
    subtitle: 'Dua jenis gerakan benda langit',
    sections: [
      {
        heading: 'Pengertian Rotasi dan Revolusi',
        paragraphs: [
          'Rotasi adalah perputaran benda pada porosnya. Contohnya, Bumi berputar pada porosnya sendiri.',
          'Revolusi adalah peredaran benda mengelilingi benda lain. Contohnya, Bumi beredar mengelilingi Matahari, dan Bulan beredar mengelilingi Bumi.',
        ],
      },
      {
        heading: 'Rotasi Bumi',
        paragraphs: [
          'Bumi berotasi (berputar pada porosnya) sekali dalam waktu sekitar 24 jam.',
          'Rotasi Bumi menyebabkan pergantian siang dan malam. Bagian Bumi yang menghadap Matahari mengalami siang, sedangkan bagian yang membelakangi Matahari mengalami malam.',
        ],
      },
      {
        heading: 'Revolusi Bumi',
        paragraphs: [
          'Bumi berevolusi (meredar) mengelilingi Matahari sekali dalam waktu sekitar 365¼ hari (satu tahun).',
          'Revolusi Bumi berkaitan dengan perubahan lama siang dan malam sepanjang tahun serta pergantian musim di banyak wilayah.',
          'Pergantian musim juga berkaitan dengan kemiringan sumbu Bumi (sekitar 23,5°) terhadap bidang orbitnya. Musim tidak terjadi hanya karena jarak Bumi ke Matahari.',
        ],
      },
      {
        heading: 'Revolusi Bulan',
        paragraphs: [
          'Bulan berevolusi mengelilingi Bumi sekitar 27,3 hari jika diukur terhadap bintang (periode sideris).',
          'Siklus fase Bulan dari purnama ke purnama berlangsung sekitar 29,5 hari (periode sinodis).',
          'Perbedaan kedua periode ini terjadi karena selama Bulan mengorbit Bumi, Bumi juga bergerak mengelilingi Matahari. Akibatnya, Bulan perlu menempuh jarak sedikit lebih jauh untuk kembali ke fase yang sama.',
        ],
      },
      {
        heading: 'Rotasi Sinkron Bulan',
        paragraphs: [
          'Periode rotasi Bulan sama dengan periode revolusinya mengelilingi Bumi. Keadaan ini disebut rotasi sinkron.',
          'Akibat rotasi sinkron, dari Bumi kita selalu melihat sisi Bulan yang sama secara umum.',
        ],
      },
    ],
    keyPoints: [
      'Rotasi: perputaran benda pada porosnya. Revolusi: peredaran benda mengelilingi benda lain.',
      'Bumi berotasi sekitar 24 jam → pergantian siang dan malam.',
      'Bumi berevolusi sekitar 365¼ hari → perubahan lama siang-malam dan musim.',
      'Bulan berevolusi sekitar 27,3 hari (terhadap bintang); siklus fase sekitar 29,5 hari.',
      'Rotasi sinkron: periode rotasi Bulan = periode revolusinya, sehingga sisi Bulan yang sama selalu menghadap Bumi.',
    ],
    reflection: [
      'Apa perbedaan rotasi dan revolusi?',
      'Mengapa kita selalu melihat sisi Bulan yang sama?',
    ],
    table: {
      headers: ['Benda Langit', 'Gerakan', 'Periode', 'Akibat / Keterangan'],
      rows: [
        ['Bumi', 'Rotasi (berputar pada poros)', 'Sekitar 24 jam', 'Pergantian siang dan malam'],
        ['Bumi', 'Revolusi (mengelilingi Matahari)', 'Sekitar 365¼ hari', 'Perubahan lama siang-malam sepanjang tahun dan pergantian musim'],
        ['Bulan', 'Revolusi (mengelilingi Bumi)', 'Sekitar 27,3 hari (terhadap bintang)', 'Peredaran Bulan; siklus fase sekitar 29,5 hari'],
        ['Bulan', 'Rotasi', 'Sekitar 27,3 hari (sinkron dengan revolusi)', 'Sisi Bulan yang sama selalu menghadap Bumi'],
      ],
    },
  },
  {
    id: 3,
    title: 'Mengapa Ada Siang dan Malam?',
    subtitle: 'Rotasi Bumi dan garis batas siang-malam',
    sections: [
      {
        heading: 'Proses Terjadinya Siang dan Malam',
        paragraphs: [
          'Matahari menyinari satu sisi Bumi. Karena Matahari sangat jauh, sinarnya mengenai Bumi hampir sejajar.',
          'Bumi berputar pada porosnya (berotasi). Akibatnya, setiap daerah di Bumi bergantian menghadap dan membelakangi Matahari.',
          'Daerah yang menghadap Matahari mengalami siang. Ketika daerah tersebut berputar menjauhi arah Matahari, daerah itu mengalami malam.',
        ],
      },
      {
        heading: 'Garis Batas Siang dan Malam',
        paragraphs: [
          'Permukaan Bumi yang disinari Matahari tampak terang (siang), sedangkan permukaan yang membelakangi Matahari tampak gelap (malam).',
          'Garis batas antara daerah siang dan malam disebut terminator. Garis ini bergerak mengikuti rotasi Bumi.',
          'Coba amati simulasi: tekan tombol "Putar Bumi" dan "Jeda" untuk melihat bagaimana garis batas siang-malam bergerak.',
        ],
      },
    ],
    keyPoints: [
      'Matahari menyinari satu sisi Bumi.',
      'Bumi berputar pada porosnya (rotasi).',
      'Daerah yang menghadap Matahari = siang; yang membelakangi = malam.',
      'Rotasi Bumi menyebabkan pergantian siang dan malam.',
    ],
    reflection: [
      'Mengapa ketika di Indonesia siang, di Amerika bisa malam?',
      'Apa yang terjadi jika Bumi tidak berotasi?',
    ],
  },
  {
    id: 4,
    title: 'Mengapa Fase Bulan Berubah?',
    subtitle: 'Bukan karena bayangan Bumi',
    sections: [
      {
        heading: 'Konsep Utama',
        paragraphs: [
          'Bulan tidak memancarkan cahaya sendiri. Cahaya yang kita lihat berasal dari Matahari dan dipantulkan oleh permukaan Bulan.',
          'Pada setiap saat, sekitar separuh permukaan Bulan yang menghadap ke ruang angkasa diterangi Matahari (dengan mengabaikan efek gerhana).',
          'Saat Bulan mengelilingi Bumi, posisi relatif Matahari, Bumi, dan Bulan berubah-ubah.',
          'Akibatnya, bagian permukaan Bulan yang terang dan terlihat dari Bumi berubah. Perubahan penampakan bagian terang tersebut disebut fase Bulan.',
        ],
      },
      {
        heading: 'Fase Bulan Bukan Disebabkan Bayangan Bumi',
        paragraphs: [
          'PENTING: Fase Bulan bukan disebabkan oleh bayangan Bumi.',
          'Bayangan Bumi menyebabkan gerhana Bulan, yaitu ketika Matahari, Bumi, dan Bulan berada dalam susunan yang sesuai sehingga Bulan memasuki bayangan Bumi.',
          'Fase Bulan terjadi karena perubahan posisi relatif ketiga benda langit, bukan karena bayangan.',
        ],
      },
      {
        heading: 'Perbandingan Fase Bulan dan Gerhana Bulan',
        paragraphs: [
          'Fase Bulan: Bulan bergerak mengelilingi Bumi, bagian terang yang terlihat dari Bumi berubah secara bertahap. Bayangan Bumi tidak menyebabkan fase Bulan.',
          'Gerhana Bulan: Bumi berada di antara Matahari dan Bulan, sehingga Bulan memasuki bayangan Bumi. Gerhana Bulan hanya terjadi pada fase purnama dan tidak terjadi setiap bulan.',
        ],
      },
    ],
    keyPoints: [
      'Bulan tidak memancarkan cahaya sendiri; ia memantulkan cahaya Matahari.',
      'Separuh permukaan Bulan yang menghadap ruang angkasa selalu diterangi Matahari.',
      'Fase Bulan terjadi karena perubahan posisi relatif Matahari, Bumi, dan Bulan.',
      'Fase Bulan bukan disebabkan oleh bayangan Bumi.',
      'Bayangan Bumi menyebabkan gerhana Bulan, bukan fase Bulan.',
    ],
    reflection: [
      'Apa perbedaan fase Bulan dan gerhana Bulan?',
      'Mengapa fase Bulan berubah setiap bulan, tetapi gerhana Bulan tidak terjadi setiap bulan?',
    ],
  },
  {
    id: 5,
    title: 'Delapan Fase Bulan',
    subtitle: 'Urutan fase dari Bulan baru kembali ke Bulan baru',
    sections: [
      {
        heading: 'Urutan Delapan Fase Bulan',
        paragraphs: [
          'Fase Bulan berubah secara berurutan dalam satu siklus sekitar 29,5 hari (dari Bulan baru ke Bulan baru berikutnya).',
          'Urutan kedelapan fase: Bulan baru → Sabit awal → Kuartal pertama → Cembung awal → Purnama → Cembung akhir → Kuartal akhir → Sabit akhir.',
          'Bulan baru: sisi Bulan yang terang umumnya menghadap menjauhi pengamat di Bumi sehingga Bulan tampak gelap atau sulit terlihat.',
          'Sabit awal: bagian terang yang terlihat berupa sabit tipis dan bertambah.',
          'Kuartal pertama: sekitar separuh cakram Bulan terlihat terang.',
          'Cembung awal: bagian terang yang terlihat lebih dari separuh dan terus bertambah.',
          'Purnama: hampir seluruh cakram Bulan yang terlihat dari Bumi tampak terang.',
          'Cembung akhir: bagian terang lebih dari separuh, tetapi berkurang.',
          'Kuartal akhir: sekitar separuh cakram Bulan terlihat terang.',
          'Sabit akhir: bagian terang yang terlihat berupa sabit tipis dan terus berkurang.',
        ],
      },
      {
        heading: 'Mengapa Orbit Bulan Miring?',
        paragraphs: [
          'Orbit Bulan sedikit miring terhadap bidang orbit Bumi mengelilingi Matahari.',
          'Karena kemiringan ini, fase-fase Bulan biasanya tidak menghasilkan gerhana setiap bulan. Gerhana hanya terjadi ketika susunan Matahari, Bumi, dan Bulan tepat sejajar.',
        ],
      },
    ],
    keyPoints: [
      'Urutan fase: Bulan baru, sabit awal, kuartal pertama, cembung awal, purnama, cembung akhir, kuartal akhir, sabit akhir.',
      'Siklus fase Bulan sekitar 29,5 hari.',
      'Fase Bulan ditentukan oleh posisi relatif Matahari, Bumi, dan Bulan.',
      'Orbit Bulan sedikit miring sehingga gerhana tidak terjadi setiap bulan.',
    ],
    reflection: [
      'Fase apa yang terjadi ketika Bumi berada di antara Matahari dan Bulan?',
      'Mengapa gerhana Bulan tidak terjadi setiap purnama?',
    ],
  },
];

// ------------------------------------------------------------
// KUIS — 20 soal pilihan ganda
// ------------------------------------------------------------
export interface QuizQuestion {
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ: QuizQuestion[] = [
  {
    topic: 'Rotasi',
    question: 'Apa yang dimaksud dengan rotasi?',
    options: [
      'Perputaran benda pada porosnya',
      'Peredaran benda mengelilingi benda lain',
      'Perubahan bentuk benda langit',
      'Gerakan benda lurus ke depan',
    ],
    correctIndex: 0,
    explanation:
      'Rotasi adalah perputaran benda pada porosnya sendiri. Bumi berotasi sekali dalam sekitar 24 jam.',
  },
  {
    topic: 'Revolusi',
    question: 'Apa yang dimaksud dengan revolusi?',
    options: [
      'Perputaran benda pada porosnya',
      'Peredaran benda mengelilingi benda lain',
      'Perubahan warna benda langit',
      'Gerakan benda menjauhi benda lain',
    ],
    correctIndex: 1,
    explanation:
      'Revolusi adalah peredaran benda mengelilingi benda lain. Contohnya, Bumi berevolusi mengelilingi Matahari.',
  },
  {
    topic: 'Periode rotasi Bumi',
    question: 'Berapa lama waktu yang dibutuhkan Bumi untuk berotasi sekali?',
    options: ['Sekitar 24 jam', 'Sekitar 365¼ hari', 'Sekitar 27,3 hari', 'Sekitar 29,5 hari'],
    correctIndex: 0,
    explanation: 'Bumi berotasi pada porosnya sekali dalam waktu sekitar 24 jam (satu hari).',
  },
  {
    topic: 'Siang dan malam',
    question: 'Apa yang menyebabkan terjadinya pergantian siang dan malam di Bumi?',
    options: [
      'Revolusi Bumi mengelilingi Matahari',
      'Rotasi Bumi pada porosnya',
      'Gerhana Bulan',
      'Jarak Bumi ke Matahari yang berubah-ubah',
    ],
    correctIndex: 1,
    explanation:
      'Rotasi Bumi pada porosnya menyebabkan pergantian siang dan malam. Bagian yang menghadap Matahari mengalami siang, bagian yang membelakangi mengalami malam.',
  },
  {
    topic: 'Periode revolusi Bumi',
    question: 'Berapa lama waktu yang dibutuhkan Bumi untuk berevolusi mengelilingi Matahari?',
    options: ['Sekitar 24 jam', 'Sekitar 27,3 hari', 'Sekitar 29,5 hari', 'Sekitar 365¼ hari'],
    correctIndex: 3,
    explanation: 'Bumi berevolusi mengelilingi Matahari sekali dalam waktu sekitar 365¼ hari (satu tahun).',
  },
  {
    topic: 'Revolusi dan siang-malam',
    question: 'Revolusi Bumi berkaitan dengan perubahan berikut, kecuali...',
    options: [
      'Perubahan lama siang dan malam sepanjang tahun',
      'Pergantian musim di banyak wilayah',
      'Pergantian siang dan malam setiap hari',
      'Perubahan posisi semu Matahari di langit',
    ],
    correctIndex: 2,
    explanation:
      'Pergantian siang dan malam setiap hari disebabkan oleh rotasi Bumi, bukan revolusi. Revolusi Bumi berkaitan dengan perubahan lama siang-malam sepanjang tahun dan pergantian musim.',
  },
  {
    topic: 'Kemiringan sumbu dan musim',
    question: 'Apa yang menyebabkan pergantian musim di banyak wilayah Bumi?',
    options: [
      'Perubahan jarak Bumi ke Matahari',
      'Kemiringan sumbu Bumi terhadap bidang orbitnya',
      'Rotasi Bulan mengelilingi porosnya',
      'Gerhana Matahari yang terjadi setiap bulan',
    ],
    correctIndex: 1,
    explanation:
      'Pergantian musim berkaitan dengan kemiringan sumbu Bumi (sekitar 23,5°) terhadap bidang orbitnya, bukan semata-mata karena jarak Bumi ke Matahari.',
  },
  {
    topic: 'Periode revolusi Bulan',
    question: 'Berapa lama waktu yang dibutuhkan Bulan untuk berevolusi mengelilingi Bumi terhadap bintang?',
    options: ['Sekitar 24 jam', 'Sekitar 27,3 hari', 'Sekitar 29,5 hari', 'Sekitar 365¼ hari'],
    correctIndex: 1,
    explanation:
      'Bulan berevolusi mengelilingi Bumi sekitar 27,3 hari jika diukur terhadap bintang (periode sideris).',
  },
  {
    topic: 'Perbedaan 27,3 dan 29,5 hari',
    question: 'Mengapa siklus fase Bulan (sekitar 29,5 hari) lebih lama daripada periode revolusi Bulan terhadap bintang (sekitar 27,3 hari)?',
    options: [
      'Karena Bulan berotasi lebih lambat',
      'Karena selama Bulan mengorbit Bumi, Bumi juga bergerak mengelilingi Matahari',
      'Karena jarak Bumi ke Matahari berubah-ubah',
      'Karena Bulan memantulkan cahaya Matahari',
    ],
    correctIndex: 1,
    explanation:
      'Selama Bulan mengorbit Bumi, Bumi juga bergerak mengelilingi Matahari. Akibatnya, Bulan perlu menempuh sedikit lebih jauh untuk kembali ke fase yang sama, sehingga siklus fase (29,5 hari) lebih lama dari periode sideris (27,3 hari).',
  },
  {
    topic: 'Rotasi sinkron',
    question: 'Apa yang dimaksud dengan rotasi sinkron Bulan?',
    options: [
      'Bulan tidak berotasi sama sekali',
      'Periode rotasi Bulan sama dengan periode revolusinya mengelilingi Bumi',
      'Bulan berotasi dua kali lebih cepat dari revolusinya',
      'Bulan selalu menghadap Matahari',
    ],
    correctIndex: 1,
    explanation:
      'Rotasi sinkron berarti periode rotasi Bulan sama dengan periode revolusinya mengelilingi Bumi. Akibatnya, dari Bumi kita selalu melihat sisi Bulan yang sama secara umum.',
  },
  {
    topic: 'Cahaya Bulan',
    question: 'Mengapa Bulan tampak bercahaya di langit malam?',
    options: [
      'Bulan menghasilkan cahaya sendiri',
      'Bulan memantulkan cahaya Matahari',
      'Bulan memantulkan cahaya Bumi',
      'Bulan terbakar oleh gesekan udara',
    ],
    correctIndex: 1,
    explanation:
      'Bulan tidak menghasilkan cahaya sendiri. Cahaya yang kita lihat berasal dari Matahari dan dipantulkan oleh permukaan Bulan.',
  },
  {
    topic: 'Penyebab fase Bulan',
    question: 'Apa yang menyebabkan perubahan fase Bulan?',
    options: [
      'Bayangan Bumi yang menutupi Bulan',
      'Perubahan posisi relatif Matahari, Bumi, dan Bulan',
      'Bulan yang berputar menjauhi Bumi',
      'Perubahan ukuran Bulan',
    ],
    correctIndex: 1,
    explanation:
      'Fase Bulan terjadi karena perubahan posisi relatif Matahari, Bumi, dan Bulan. Fase Bulan bukan disebabkan oleh bayangan Bumi.',
  },
  {
    topic: 'Urutan fase Bulan',
    question: 'Manakah urutan fase Bulan yang benar?',
    options: [
      'Bulan baru → sabit awal → kuartal pertama → cembung awal → purnama → cembung akhir → kuartal akhir → sabit akhir',
      'Purnama → kuartal pertama → sabit awal → Bulan baru → sabit akhir → kuartal akhir → cembung akhir → cembung awal',
      'Bulan baru → kuartal pertama → sabit awal → purnama → cembung awal → kuartal akhir → cembung akhir → sabit akhir',
      'Sabit awal → Bulan baru → cembung awal → kuartal pertama → purnama → sabit akhir → kuartal akhir → cembung akhir',
    ],
    correctIndex: 0,
    explanation:
      'Urutan kedelapan fase Bulan yang benar: Bulan baru, sabit awal, kuartal pertama, cembung awal, purnama, cembung akhir, kuartal akhir, sabit akhir.',
  },
  {
    topic: 'Ciri Bulan baru',
    question: 'Bagaimanakah penampakan Bulan pada fase Bulan baru?',
    options: [
      'Hampir seluruh cakram terlihat terang',
      'Sekitar separuh cakram terlihat terang',
      'Tampak gelap atau sulit terlihat karena sisi terang menghadap menjauhi Bumi',
      'Terlihat seperti sabit tipis di sebelah kanan',
    ],
    correctIndex: 2,
    explanation:
      'Pada Bulan baru, sisi Bulan yang terang umumnya menghadap menjauhi pengamat di Bumi sehingga Bulan tampak gelap atau sulit terlihat.',
  },
  {
    topic: 'Ciri kuartal pertama',
    question: 'Bagaimanakah penampakan Bulan pada fase kuartal pertama?',
    options: [
      'Hampir seluruh cakram terlihat terang',
      'Sekitar separuh cakram terlihat terang',
      'Tampak gelap sama sekali',
      'Hanya berupa sabit tipis',
    ],
    correctIndex: 1,
    explanation: 'Pada kuartal pertama, sekitar separuh cakram Bulan terlihat terang dari Bumi.',
  },
  {
    topic: 'Ciri Bulan purnama',
    question: 'Bagaimanakah penampakan Bulan pada fase purnama?',
    options: [
      'Tampak gelap atau sulit terlihat',
      'Hanya berupa sabit tipis',
      'Hampir seluruh cakram yang terlihat dari Bumi tampak terang',
      'Sekitar separuh cakram terlihat terang',
    ],
    correctIndex: 2,
    explanation: 'Pada purnama, hampir seluruh cakram Bulan yang terlihat dari Bumi tampak terang.',
  },
  {
    topic: 'Ciri kuartal akhir',
    question: 'Bagaimanakah penampakan Bulan pada fase kuartal akhir?',
    options: [
      'Hampir seluruh cakram terlihat terang',
      'Sekitar separuh cakram terlihat terang',
      'Tampak gelap sama sekali',
      'Berupa sabit tipis yang bertambah',
    ],
    correctIndex: 1,
    explanation:
      'Pada kuartal akhir, sekitar separuh cakram Bulan terlihat terang. Di belahan utara, sisi kiri cakram yang tampak terang.',
  },
  {
    topic: 'Fase vs gerhana',
    question: 'Apa perbedaan fase Bulan dan gerhana Bulan?',
    options: [
      'Fase Bulan disebabkan bayangan Bumi, gerhana disebabkan posisi relatif',
      'Fase Bulan disebabkan perubahan posisi relatif Matahari, Bumi, dan Bulan; gerhana Bulan terjadi ketika Bulan memasuki bayangan Bumi',
      'Keduanya disebabkan oleh bayangan Bumi',
      'Keduanya terjadi setiap bulan',
    ],
    correctIndex: 1,
    explanation:
      'Fase Bulan terjadi karena perubahan posisi relatif Matahari, Bumi, dan Bulan (bukan bayangan Bumi). Gerhana Bulan terjadi ketika Bulan memasuki bayangan Bumi. Tidak setiap purnama menghasilkan gerhana Bulan.',
  },
  {
    topic: 'Pengamatan simulasi',
    question: 'Pada simulasi, di manakah posisi Bulan baru jika dilihat dari Bumi?',
    options: [
      'Berlawanan arah dengan Matahari',
      'Di antara Bumi dan Matahari (searah dengan Matahari)',
      'Tepat di atas kutub utara Bumi',
      'Di posisi mana pun karena Bulan tidak bergerak',
    ],
    correctIndex: 1,
    explanation:
      'Bulan baru berada di antara Bumi dan Matahari, sehingga sisi Bulan yang terang menghadap menjauhi pengamat di Bumi dan Bulan tampak gelap.',
  },
  {
    topic: 'Analisis posisi',
    question: 'Kapan fase Bulan purnama terjadi berdasarkan posisi Matahari, Bumi, dan Bulan?',
    options: [
      'Ketika Bulan berada di antara Matahari dan Bumi',
      'Ketika Bumi berada di antara Matahari dan Bulan',
      'Ketika Matahari berada di antara Bumi dan Bulan',
      'Ketika Bulan berada di atas kutub selatan Bumi',
    ],
    correctIndex: 1,
    explanation:
      'Purnama terjadi ketika Bumi berada di antara Matahari dan Bulan, sehingga sisi Bulan yang terang menghadap ke Bumi dan hampir seluruh cakram terlihat terang.',
  },
];

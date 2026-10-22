# 🚀 TeleVideo Pro - GitHub Hosting & Setup Guide (গিটহাব হোস্টিং গাইড)

এই প্রজেক্টটি একটি সম্পূর্ণ আধুনিক **React + TypeScript + Vite + Tailwind CSS** অ্যাপ্লিকেশন। এটি সরাসরি **GitHub Pages**, **Vercel**, অথবা **Netlify** তে সম্পূর্ণ ফ্রিতে হোস্ট করা যায়।

---

## 🌟 পদ্ধতি ১: GitHub Pages এ ফ্রিতে অটোমেটিক হোস্টিং (সবচেয়ে সহজ ও জনপ্রিয়)

আপনার ডাউনলোড করা ফাইলের মধ্যে ইতিমধ্যে **`.github/workflows/deploy.yml`** ফাইলটি রেডি করা আছে। আপনি গিটহাবে কোড পুশ করলেই এটি অটোমেটিক লাইভ হয়ে যাবে!

### সহজ ৩টি ধাপ:

1. **গিটহাবে নতুন Repository তৈরি করুন:**
   - [github.com/new](https://github.com/new) এ যান।
   - একটি নাম দিন (যেমন: `televideo-pro`)।
   - এটিকে **Public** রাখুন এবং `Create repository` বাটনে চাপুন।

2. **ডাউনলোড করা ফাইলগুলো গিটহাবে আপলোড করুন:**
   - **অপশন A (গিট কমান্ড ব্যবহার করে):**
     ```bash
     git init
     git add .
     git commit -m "Initial TeleVideo Pro commit"
     git branch -M main
     git remote add origin https://github.com/<আপনার-ইউজারনেম>/televideo-pro.git
     git push -u origin main
     ```
   - **অপশন B (ওয়েবসাইটে ড্র্যাগ অ্যান্ড ড্রপ):**
     - GitHub Repository পেজে গিয়ে **"uploading an existing file"** লিংকে ক্লিক করুন।
     - ডাউনলোড করা জিপ ফাইলটি আনজিপ করে ভেতরের সব ফাইল ও ফোল্ডার ড্র্যাগ অ্যান্ড ড্রপ করে কমিট করুন।

3. **GitHub Pages চালু করুন:**
   - আপনার রিপোজিটরির **Settings** ট্যাবে যান।
   - বাম পাশের মেনু থেকে **Pages** এ ক্লিক করুন।
   - **Build and deployment -> Source** এ ড্রপডাউন থেকে **"GitHub Actions"** সিলেক্ট করুন।
   - ব্যাস! ১-২ মিনিটের মধ্যে আপনার ওয়েবসাইটটি লাইভ হয়ে যাবে এই ঠিকানায়:
     👉 `https://<আপনার-ইউজারনেম>.github.io/televideo-pro/`

---

## 🌟 পদ্ধতি ২: সরাসরি Pre-built Dist দিয়ে GitHub Pages হোস্টিং

আপনি যদি কোনো কমান্ড না চালিয়ে সরাসরি লাইভ করতে চান:
1. ডাউনলোড অপশন থেকে **`televideo-pro-gh-pages-dist.zip`** ডাউনলোড করে আনজিপ করুন।
2. গিটহাবে একটি নতুন রিপোজিটরি বানিয়ে আনজিপ করা সব ফাইল (`index.html`, `assets/` ফোল্ডার ইত্যাদি) আপলোড করুন।
3. **Settings -> Pages** এ গিয়ে Branch সিলেক্ট করুন `main` এবং ফোল্ডার সিলেক্ট করুন `/ (root)` এবং Save করুন।

---

## 🌟 পদ্ধতি ৩: Vercel বা Netlify তে ১-ক্লিকে ফ্রি হোস্টিং

- **Vercel:** [vercel.com](https://vercel.com) এ লগইন করে `Import Project` দিয়ে আপনার GitHub রিপোজিটরি সিলেক্ট করুন। অটোমেটিক ডিটেক্ট করে লাইভ ডোমেইন পেয়ে যাবেন।
- **Netlify:** [netlify.com](https://netlify.com) এ `Add new site -> Import an existing project` দিয়ে আপনার রিপো কানেক্ট করুন।

---

## 💻 লোকাল কম্পিউটারে রান করার নিয়ম:

```bash
# ১. ডিপেনডেন্সি ইন্সটল
npm install

# ২. ডেভেলপমেন্ট সার্ভার চালু
npm run dev

# ৩. প্রোডাকশন বিল্ড তৈরি
npm run build
```

---

## 🔐 এডমিন প্যানেল এক্সেস:
- অ্যাপ্লিকেশনের এডমিন পিন: `1234`
- যেকোনো সহায়তা বা প্রয়োজনে টেলিগ্রাম চ্যানেল ও সাপোর্ট সংযুক্ত রয়েছে।

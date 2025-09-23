'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';
import cn from 'classnames';

import AdminHeader from '../_components/admin-header';
import s from './page.module.css';

export default function AddRafflePage() {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const isFormValid = productName.trim() !== '' && quantity.trim() !== '' && Number(quantity) > 0;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: 이미지 업로드 기능 구현
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageClick = () => {
    // TODO: 이미지 업로드 기능 구현
    document.getElementById('image-input')?.click();
  };

  const handleSubmit = () => {
    // TODO: 상품 등록 API 호출
    console.log('상품 등록:', { productName, quantity, selectedImage });
    // TODO: 등록 완료 후 목록 페이지로 이동
  };

  return (
    <div className={s.container}>
      <AdminHeader title="상품 등록" />

      <main className={s.main}>
        <div className={s.formContainer}>
          <div className={s.fieldGroup}>
            <label className={s.label}>상품 사진</label>
            <div className={s.imageUpload} onClick={handleImageClick}>
              <div className={s.imageIcon}>
                <Camera size={20} />
              </div>
              <span className={s.imageText}>사진 추가</span>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={s.hiddenInput}
              />
            </div>
          </div>

          <div className={s.fieldGroup}>
            <label className={s.label}>상품명</label>
            <input
              type="text"
              placeholder="상품명을 입력하세요"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className={s.input}
            />
          </div>

          <div className={s.fieldGroup}>
            <label className={s.label}>수량</label>
            <input
              type="number"
              placeholder="수량을 입력하세요"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={s.input}
              min="1"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={cn(s.submitButton, {
            [s.active]: isFormValid,
            [s.disabled]: !isFormValid,
          })}
        >
          상품 등록
        </button>
      </main>
    </div>
  );
}
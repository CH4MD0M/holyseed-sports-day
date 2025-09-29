'use client';

import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';
import cn from 'classnames';

import s from './page.module.css';
import PageLayout from '@/components/layout/page-layout';

export default function AddRafflePage() {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

  const isFormValid = productName.trim() !== '' && quantity.trim() !== '' && Number(quantity) > 0;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 형식 검증
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('JPG, PNG 형식의 이미지만 업로드 가능합니다.');
        return;
      }

      setSelectedImage(file);

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (!imagePreview) {
      document.getElementById('image-input')?.click();
    }
  };

  const handleImageDelete = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setIsDeleteHovered(false);
    // 파일 input 초기화
    const input = document.getElementById('image-input') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleSubmit = () => {
    // TODO: 상품 등록 API 호출
    console.log('상품 등록:', { productName, quantity, selectedImage });
    // TODO: 등록 완료 후 목록 페이지로 이동
  };

  return (
    <PageLayout title="상품 등록">
      <main className={s.main}>
        <div className={s.formContainer}>
          <div className={s.fieldGroup}>
            <label className={s.label}>상품 사진 (1장)</label>
            <div className={s.imageContainer}>
              {!imagePreview ? (
                <div className={s.imageUpload} onClick={handleImageClick}>
                  <div className={s.imageIcon}>
                    <Camera size={20} />
                  </div>
                  <span className={s.imageText}>사진 추가</span>
                </div>
              ) : (
                <div className={s.imagePreviewContainer}>
                  <Image
                    src={imagePreview}
                    alt="상품 미리보기"
                    width={96}
                    height={96}
                    className={s.imagePreview}
                  />
                  <button
                    onClick={handleImageDelete}
                    onMouseEnter={() => setIsDeleteHovered(true)}
                    onMouseLeave={() => setIsDeleteHovered(false)}
                    className={cn(s.deleteButton, {
                      [s.deleteButtonHovered]: isDeleteHovered,
                    })}
                    aria-label="이미지 삭제"
                  >
                    <X size={isDeleteHovered ? 15 : 12} />
                  </button>
                </div>
              )}
              <input
                id="image-input"
                type="file"
                accept="image/jpeg,image/png"
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
    </PageLayout>
  );
}

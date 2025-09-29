'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';
import cn from 'classnames';

import { getRaffleItemById, type RaffleItem } from '@/lib/mock/sample-raffle-items';

import PageLayout from '@/components/layout/page-layout';
import s from './page.module.css';

export default function EditRafflePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem] = useState<RaffleItem | null>(null);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

  useEffect(() => {
    const foundItem = getRaffleItemById(id);
    if (!foundItem) {
      alert('존재하지 않는 상품입니다.');
      router.push('/admin/raffle');
      return;
    }

    setItem(foundItem);
    setProductName(foundItem.name);
    setQuantity(foundItem.totalQuantity.toString());

    // 기존 이미지가 있으면 미리보기로 설정
    if (foundItem.image) {
      setImagePreview(foundItem.image);
    }
  }, [id, router]);

  const isFormValid = productName.trim() !== '' && quantity.trim() !== '' && Number(quantity) > 0;
  const remainingQuantity = item ? Number(quantity) - item.usedQuantity : 0;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('JPG, PNG 형식의 이미지만 업로드 가능합니다.');
        return;
      }

      setSelectedImage(file);

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
    const input = document.getElementById('image-input') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value);

    if (item && Number(value) < item.usedQuantity) {
      alert(`수량은 사용된 수량(${item.usedQuantity}개)보다 작을 수 없습니다.`);
    }
  };

  const handleSubmit = () => {
    if (!item) return;

    if (Number(quantity) < item.usedQuantity) {
      alert(`수량은 사용된 수량(${item.usedQuantity}개)보다 작을 수 없습니다.`);
      return;
    }

    // TODO: 상품 수정 API 호출
    console.log('상품 수정:', {
      id: item.id,
      productName,
      quantity: Number(quantity),
      selectedImage,
    });

    // TODO: 수정 완료 후 실제 데이터 업데이트
    router.push('/admin/raffle');
  };

  if (!item) {
    return null;
  }

  return (
    <PageLayout title="상품 수정">
      <div className={s.container}>
        <div className={s.formContainer}>
          <div className={s.fieldGroup}>
            <label className={s.label}>상품 사진</label>
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
            <label className={s.label}>사용 현황</label>
            <div className={s.usageBox}>
              <div className={s.usageItem}>
                <span className={s.usageLabel}>총 수량</span>
                <span className={cn(s.usageValue, s.total)}>{item.totalQuantity}개</span>
              </div>
              <div className={s.usageItem}>
                <span className={s.usageLabel}>사용된 수량</span>
                <span className={cn(s.usageValue, s.used)}>{item.usedQuantity}개</span>
              </div>
              <div className={s.usageItem}>
                <span className={s.usageLabel}>남은 수량</span>
                <span className={cn(s.usageValue, s.remaining)}>
                  {Math.max(0, remainingQuantity)}개
                </span>
              </div>
            </div>
          </div>

          <div className={s.fieldGroup}>
            <label className={s.label}>수량</label>
            <input
              type="number"
              placeholder="수량을 입력하세요"
              value={quantity}
              onChange={handleQuantityChange}
              className={s.input}
              min={item.usedQuantity}
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
          수정 완료
        </button>
      </div>
    </PageLayout>
  );
}

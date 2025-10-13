'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/utils/supabase/server';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase.type';

export type Prize = Tables<'prizes'>;
export type PrizeInsert = TablesInsert<'prizes'>;
export type PrizeUpdate = TablesUpdate<'prizes'>;

/**
 * 전체 상품 목록 조회
 */
export async function getPrizes(): Promise<Prize[]> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from('prizes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('상품 목록 조회 실패:', error);
    throw new Error('상품 목록을 불러오는데 실패했습니다.');
  }

  return data || [];
}

/**
 * 특정 상품 조회
 */
export async function getPrizeById(id: string): Promise<Prize | null> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase.from('prizes').select('*').eq('id', id).single();

  if (error) {
    console.error('상품 조회 실패:', error);
    return null;
  }

  return data;
}

/**
 * 상품 생성
 *
 * TODO: Supabase Storage 버킷 'prizes' 생성 필요
 * - 현재는 image_url을 직접 입력 또는 null로 처리
 * - Storage 버킷 생성 후 이미지 업로드 기능 추가 예정
 */
export async function createPrize(
  prize: Omit<PrizeInsert, 'id' | 'created_at' | 'updated_at'>
): Promise<Prize> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from('prizes')
    .insert({
      name: prize.name,
      description: prize.description || null,
      image_url: prize.image_url || null,
      total_quantity: prize.total_quantity,
      remaining_quantity: prize.remaining_quantity,
    })
    .select()
    .single();

  if (error) {
    console.error('상품 생성 실패:', error);
    throw new Error('상품을 등록하는데 실패했습니다.');
  }

  revalidatePath('/admin/prizes');
  return data;
}

/**
 * 상품 수정
 *
 * TODO: Supabase Storage 버킷 'prizes' 생성 필요
 * - 현재는 image_url을 직접 입력 또는 null로 처리
 * - Storage 버킷 생성 후 이미지 업로드 기능 추가 예정
 */
export async function updatePrize(id: string, prize: PrizeUpdate): Promise<Prize> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from('prizes')
    .update(prize)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('상품 수정 실패:', error);
    throw new Error('상품을 수정하는데 실패했습니다.');
  }

  revalidatePath('/admin/prizes');
  return data;
}

/**
 * 상품 삭제
 */
export async function deletePrize(id: string): Promise<void> {
  const supabase = await supabaseServer();

  const { error } = await supabase.from('prizes').delete().eq('id', id);

  if (error) {
    console.error('상품 삭제 실패:', error);
    throw new Error('상품을 삭제하는데 실패했습니다.');
  }

  revalidatePath('/admin/prizes');
}

/**
 * 상품 이미지 업로드
 */
export async function uploadPrizeImage(file: File): Promise<string> {
  const supabase = await supabaseServer();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage.from('prizes').upload(filePath, file);

  if (uploadError) {
    console.error('이미지 업로드 실패:', uploadError);
    throw new Error('이미지 업로드에 실패했습니다.');
  }

  const { data } = supabase.storage.from('prizes').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * 상품 이미지 삭제
 */
export async function deletePrizeImage(url: string): Promise<void> {
  const supabase = await supabaseServer();
  const fileName = url.split('/').pop();
  if (!fileName) return;

  const { error } = await supabase.storage.from('prizes').remove([fileName]);

  if (error) {
    console.error('이미지 삭제 실패:', error);
  }
}

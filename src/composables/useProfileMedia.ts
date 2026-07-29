import { ref, computed, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { StorageUtils } from '@/utils/store.utils';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { getAvatarUrl as getAvatar, getBannerUrl as getBanner, getGalleryMedia, getMediaUrl as resolveMediaUrl } from '@/utils/media.utils';
import axios from 'axios';

export function useProfileMedia(userMedias: Ref<any[]>, fetchProfile: () => Promise<void>) {
  const router = useRouter();

  const avatarInputRef = ref<HTMLInputElement | null>(null);
  const bannerInputRef = ref<HTMLInputElement | null>(null);
  const galleryInput = ref<HTMLInputElement | null>(null);
  const uploadingImage = ref(false);

  // Cropper state
  const showCropper = ref(false);
  const cropImageSrc = ref('');
  const cropTitle = ref('Recadrer l\'image');
  const cropFileName = ref('image.jpg');
  const cropStencilType = ref<'circle' | 'rectangle'>('circle');
  const cropAspectRatio = ref(1);
  const cropType = ref<'avatar' | 'banner'>('avatar');

  const error = ref<string | null>(null);

  const avatarUrl = computed(() => getAvatar(userMedias.value));
  const bannerUrl = computed(() => getBanner(userMedias.value));
  const gallery = computed(() => getGalleryMedia(userMedias.value));
  const getMediaUrl = (media: any) => resolveMediaUrl(media);

  const uploadMedia = async (file: File, typeMediaSlug?: string): Promise<any> => {
    const nToken = await StorageUtils().getStore('nToken');
    const token = nToken?.value;
    if (!token) {
      router.push({ name: 'AUTH_SIGN_IN' });
      return null;
    }
    const formData = new FormData();
    formData.append('file', file);
    if (typeMediaSlug) {
      formData.append('type', typeMediaSlug);
    }
    const response = await axios.post(`${URL_API_ROUTE.MEDIA_UPLOAD}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  const triggerAvatarUpload = () => {
    avatarInputRef.value?.click();
  };

  const handleAvatarUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      cropType.value = 'avatar';
      cropImageSrc.value = URL.createObjectURL(file);
      cropFileName.value = file.name;
      cropTitle.value = 'Recadrer votre photo de profil';
      cropStencilType.value = 'circle';
      cropAspectRatio.value = 1;
      showCropper.value = true;
    }
    if (target) target.value = '';
  };

  const triggerBannerUpload = () => {
    bannerInputRef.value?.click();
  };

  const handleBannerUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      cropType.value = 'banner';
      cropImageSrc.value = URL.createObjectURL(file);
      cropFileName.value = file.name;
      cropTitle.value = 'Recadrer votre bannière';
      cropStencilType.value = 'rectangle';
      cropAspectRatio.value = 3 / 1;
      showCropper.value = true;
    }
    if (target) target.value = '';
  };

  const onCrop = async ({ file }: { file: File; dataUrl: string }) => {
    showCropper.value = false;
    URL.revokeObjectURL(cropImageSrc.value);
    const typeSlug = cropType.value === 'avatar' ? 'photo_profil' : 'photo_banniere';
    try {
      uploadingImage.value = true;
      await uploadMedia(file, typeSlug);
      await fetchProfile();
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Erreur lors du téléchargement de l\'image';
    } finally {
      uploadingImage.value = false;
    }
  };

  const triggerGalleryUpload = () => {
    galleryInput.value?.click();
  };

  const handleGalleryUpload = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (!file) return;
    try {
      uploadingImage.value = true;
      await uploadMedia(file, 'type_galery');
      await fetchProfile();
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Erreur lors de l\'ajout de la photo';
    } finally {
      uploadingImage.value = false;
    }
    if (target) target.value = '';
  };

  const deleteGalleryImage = async (media: any) => {
    try {
      const nToken = await StorageUtils().getStore('nToken');
      const token = nToken?.value;
      if (!token) return;
      await axios.delete(`${URL_API_ROUTE.MEDIA_DELETE}/${media.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProfile();
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Erreur lors de la suppression';
    }
  };

  return {
    avatarInputRef,
    bannerInputRef,
    galleryInput,
    uploadingImage,
    showCropper,
    cropImageSrc,
    cropTitle,
    cropFileName,
    cropStencilType,
    cropAspectRatio,
    error,
    avatarUrl,
    bannerUrl,
    gallery,
    getMediaUrl,
    uploadMedia,
    triggerAvatarUpload,
    handleAvatarUpload,
    triggerBannerUpload,
    handleBannerUpload,
    onCrop,
    triggerGalleryUpload,
    handleGalleryUpload,
    deleteGalleryImage,
  };
}

import AdminChildPage from '@/components/AdminChildPage';
import { redirect } from 'next/navigation';
import { getPhotosCached } from '@/photo/cache';
import { PATH_ADMIN, PATH_ADMIN_RECIPES, pathForRecipe } from '@/app/paths';
import PhotoLightbox from '@/photo/PhotoLightbox';
import { getPhotosMeta } from '@/photo/db/query';
import AdminRecipeBadge from '@/admin/AdminRecipeBadge';
import AdminRecipeForm from '@/admin/AdminRecipeForm';
import { getPhotoWithRecipeFromPhotos } from '@/recipe';
import AdminShowRecipeButton from '@/admin/AdminShowRecipeButton';

const MAX_PHOTO_TO_SHOW = 6;

interface Props {
  params: Promise<{ recipe: string }>
}

export default async function RecipePageEdit({
  params,
}: Props) {
  const { recipe: recipeFromParams } = await params;

  const recipe = decodeURIComponent(recipeFromParams);
  
  const [
    { count },
    photos,
  ] = await Promise.all([
    getPhotosMeta({ recipe }),
    getPhotosCached({ recipe, limit: MAX_PHOTO_TO_SHOW }),
  ]);

  const {
    recipeData,
    filmSimulation,
  } = getPhotoWithRecipeFromPhotos(photos) ?? {};

  if (count === 0) { redirect(PATH_ADMIN); }

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_RECIPES}
      backLabel="Recipes"
      breadcrumb={<AdminRecipeBadge {...{ recipe, count, hideBadge: true }} />}
      accessory={recipeData && filmSimulation &&
        <AdminShowRecipeButton
          title={recipe}
          recipe={recipeData}
          simulation={filmSimulation}
        />
      }
    >
      <AdminRecipeForm {...{ recipe, photos }}>
        <PhotoLightbox
          {...{ count, photos, recipe }}
          maxPhotosToShow={MAX_PHOTO_TO_SHOW}
          moreLink={pathForRecipe(recipe)}
        />
      </AdminRecipeForm>
    </AdminChildPage>
  );
};

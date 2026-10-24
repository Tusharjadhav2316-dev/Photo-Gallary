import PhotoCard from './PhotoCard'

export default function PhotoGrid({ photos, favorites, onToggleFavorite }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          isFavorite={favorites.includes(String(photo.id))}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}

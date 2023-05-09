import { anchorClass, className, profilePhoto } from './ProfileBadge.css';

export type ProfileBadgeProps = {
  displayName: string;
  profilePhotoUrl: string;
};

function ProfileBadge({ displayName, profilePhotoUrl }: ProfileBadgeProps) {
  return (
    <a className={anchorClass} href="https://spotify.com/account" target="_blank" rel="noreferrer">
      <div className={className}>
        {profilePhotoUrl && <img className={profilePhoto} src={profilePhotoUrl}></img>}
        <div>{displayName}</div>
      </div>
    </a>
  );
}

export default ProfileBadge;

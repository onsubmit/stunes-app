import { className, profilePhoto } from './ProfileBadge.css';

export type ProfileBadgeProps = {
  displayName: string;
  profilePhotoUrl: string;
};

function ProfileBadge({ displayName, profilePhotoUrl }: ProfileBadgeProps) {
  return (
    <a className={className} href="https://spotify.com/account" target="_blank" rel="noreferrer">
      <div className={className}>
        {profilePhotoUrl && <img className={profilePhoto} src={profilePhotoUrl}></img>}
        <div>{displayName}</div>
      </div>
    </a>
  );
}

export default ProfileBadge;

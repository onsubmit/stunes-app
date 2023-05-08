import { className, profilePhoto } from './ProfileBadge.css';

export type ProfileBadgeProps = {
  displayName: string;
  profilePhotoUrl: string;
};

function ProfileBadge({ displayName, profilePhotoUrl }: ProfileBadgeProps) {
  return (
    <div className={className}>
      <>
        {profilePhotoUrl && <img className={profilePhoto} src={profilePhotoUrl}></img>}
        <div>{displayName}</div>
      </>
    </div>
  );
}

export default ProfileBadge;

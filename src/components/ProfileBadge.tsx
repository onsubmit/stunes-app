import { className, profilePhoto } from './ProfileBadge.css';

export type ProfileBadgeProps = {
  displayName: string;
  profilePhotoUrl: string;
  profileUrl: string;
};

function ProfileBadge({ displayName, profilePhotoUrl, profileUrl }: ProfileBadgeProps) {
  function getElement(): JSX.Element {
    const badge = (
      <>
        {profilePhotoUrl && <img className={profilePhoto} src={profilePhotoUrl}></img>}
        <div>{displayName}</div>
      </>
    );

    if (!profileUrl) {
      return <div className={className}>{badge}</div>;
    }

    return (
      <a className={className} href={profileUrl} target="_blank" rel="noreferrer">
        {badge}
      </a>
    );
  }
  return getElement();
}

export default ProfileBadge;

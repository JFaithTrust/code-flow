import { auth, signOut } from '@/auth';
import ROUTES from '@/constants/routes';

import { Button } from '@/components/ui/button';

export default async function Home() {
  const session = await auth();

  return (
    <>
      <form
        className="px-10 pt-[100px]"
        action={async () => {
          'use server';
          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
      >
        <Button type="submit">Log out</Button>
      </form>
    </>
  );
}

import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getInterviewByUserId, getLatestInterviews } from '@/lib/actions/general.action'
import Image from 'next/image'
import Link from 'next/link'

const HomePage = async () => {

    const user = await getCurrentUser();

    const [userInterviews, latestInterviews] = await Promise.all([
        getInterviewByUserId(user?.id!),
        getLatestInterviews({userId : user?.id! })
    ])

    const pastInterviews = (userInterviews?.length ?? 0) > 0;
    const hasUpCommingInterviews = (latestInterviews?.length ?? 0) > 0;

    return (
        <>
            <section className='card-cta'>
                <div className='flex flex-col gap-6 max-w-lg'>
                    <h2>
                        Get Interview-Ready with AI-Powered Practice and Feedback
                    </h2>

                    <p className='text-lg'>
                        Practice on Real Interview Questions & get Instant Feedback
                    </p>

                    <Button asChild className='btn-primary max-sm:w-full'>
                        <Link href="/interview">
                            Start an Interview
                        </Link>
                    </Button>
                </div>

                <Image 
                    src="/robot.png"
                    alt='Hero Image'
                    width={400}
                    height={400}
                    className='max-sm:hidden'
                />
            </section>

            <section className='flex flex-col gap-6 mt-8'>
                <h2>Your Interveiws</h2>

                <div className='interviews-section'> 
                    {   
                        pastInterviews ? (
                            userInterviews?.map( (interviews) => (
                                <InterviewCard {...interviews} key={interviews.id}/>
                            ))) : 
                            <p>
                                You haven't taken any interview yer!
                            </p> 
                    } 
                </div>    
            </section>

            <section className='flex flex-col gap-6 mt-8'>
                <h2>Take an Interveiw</h2>

                <div className='interviews-section'>
                    {   
                        hasUpCommingInterviews ? (
                            latestInterviews?.map( (interviews) => (
                                <InterviewCard {...interviews} key={interviews.id}/>
                            ))) : 
                            <p>
                                There are no new Interviews available.
                            </p> 
                    }
                </div>
            </section>
        </>
    )
}
export default HomePage

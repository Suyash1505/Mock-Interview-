import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'
import React from 'react'

const interviewPage = async () => {

    const user = await getCurrentUser();

    return (
        <>
            <h3>
                Interview Generation
            </h3>

            <Agent
                userName={user?.name!}
                userId={user?.id}
                interviewId={id}
                type="interview"
                questions={interview.questions}
                feedbackId={feedback?.id}
            />
        </>
    )
}

export default interviewPage

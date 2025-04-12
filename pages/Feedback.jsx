import React, { useState } from "react"

const { default: PageTitle } = require("../components/PageTitle")
const { default: ReviewsForm } = require("../components/Reviews/reviews-form")

const Feedback = ({}) => {
    const [, setIsModalOpen] = useState(false);

    return (
        <div className='w-full h-full flex flex-col items-center justify-center'>
            <PageTitle title={"Feedback Form"} />

            <div className="my-7 max-w-[500px] border border-gray-100 rounded-md">
                <ReviewsForm setIsModalOpen={setIsModalOpen} />
            </div>
        </div>
    )
}

export default React.memo(Feedback)
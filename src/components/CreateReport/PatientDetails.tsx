import React from 'react'
import Heading from './Heading'
import { PiUserListFill } from "react-icons/pi";
import TextInput from './Inputs/TextInput';
import type { CreateCaseResponse } from '@api/cases';
import { formaToMonthDayYear } from '@utils/dateUtils';
import { capitalizeFirst } from '@utils/stringUtils';

function PatientDetails({ details }: { details: CreateCaseResponse | null }) {
    return (
        <div className='flex flex-col col-span-3 p-3 border rounded-lg border-border shadow gap-4'>
            <Heading title='Patient Details' icon={PiUserListFill} />

            <div className='grid grid-cols-2 gap-4 items-start'>

                <TextInput
                    name="patientName"
                    label="Patient Name"
                    placeholder="John Doe"
                    value={details?.demographics.name}
                    readOnly
                />

                <TextInput
                    name="dob"
                    label="Date of Birth"
                    placeholder="--/--/--"
                    value={formaToMonthDayYear(details?.demographics.dob)}
                    readOnly
                />

                <TextInput
                    name="gender"
                    label="Gender"
                    placeholder="--"
                    value={capitalizeFirst(details?.demographics.gender)}
                    readOnly
                />

                <TextInput
                    name="injuryDate"
                    label="Date of Injury"
                    placeholder="--/--/--"
                    value={formaToMonthDayYear(details?.demographics.date_of_injury)}
                    readOnly
                />

                <TextInput
                    name="ageAtConsult"
                    label="Age at consult"
                    placeholder="--/--/--"
                    value={details?.demographics.age_at_consult}
                    readOnly
                />

                <TextInput
                    name="workStatus"
                    label="Work status"
                    placeholder="--"
                    value={details?.demographics.work_status}
                    readOnly
                />

                <TextInput
                    name="claimNumber"
                    label="Claim Number"
                    placeholder="CLM12345"
                    value={details?.demographics.claim_number}
                    readOnly
                />

                <TextInput
                    name="employer"
                    label="Employer"
                    placeholder="ABC Corp"
                    value={details?.demographics.employer}
                    readOnly
                />

                <div className="col-span-2 text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-md p-3 ">
                    Patient details will be automatically extracted from the uploaded medical documents once processing is complete.
                </div>
            </div>
        </div>
    )
}

export default PatientDetails
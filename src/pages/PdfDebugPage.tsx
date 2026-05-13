import { PdfPreview } from "@utils/pdfGenerator";

export default function PdfDebugPage() {
    const mockData = {
        "report": [
            {
                "main_header": "CLINICAL TEAM",
                "content": "The multidisciplinary team includes physicians, a psychologist, and a physical therapist.",
                "sub_sections": [
                    {
                        "sub_header": "Medical Doctor",
                        "content": "Michael H. Lowenstein, M.D.\nJack O. Piasecki, M.D., PTP\nRussell Sanders, PA-C\nAcu Trans Solution, LLC",
                        "source": "All Reports"
                    },
                    {
                        "sub_header": "Psychologist",
                        "content": "Michael J. Bjornson, Ph.D\nAzita Yazdani",
                        "source": "Psych Report"
                    },
                    {
                        "sub_header": "Physical Therapist",
                        "content": "Azita Yazdani",
                        "source": "Multiple Reports"
                    }
                ]
            },
            {
                "main_header": "REASON FOR EVALUATION",
                "content": "Secondary treating physician’s pain management follow-up evaluation and request for authorization. Additionally, a psychosocial evaluation was performed to determine suitability for a Functional Restoration Program.",
                "sub_sections": []
            },
            {
                "main_header": "RECORDS REVIEWED",
                "content": "The MD report was dictated but not reviewed. The psychologist noted that the medical chart was reviewed as part of the evaluation. No specific record review note was provided in the PT report.",
                "sub_sections": []
            },
            {
                "main_header": "HISTORY OF PRESENT ILLNESS",
                "content": "",
                "sub_sections": [
                    {
                        "sub_header": "Date and Mechanism of Injury",
                        "content": "Injury occurred on 05/15/23.",
                        "source": "MD Reports"
                    },
                    {
                        "sub_header": "Primary Complaints",
                        "content": "Right buttock pain radiating into the right lower extremity with numbness and tingling\nlow back pain now reduced to 1‑2/10 after radiofrequency thermocoagulation\ndifficulty walking greater than 10 minutes due to right lower extremity radicular pain rated 6/10.",
                        "source": "MD Reports"
                    },
                    {
                        "sub_header": "Pain Duration and Progression",
                        "content": "Low back pain markedly improved after right L4‑L5 and L5‑S1 radiofrequency thermocoagulation performed on 12/23/2024 with approximately 80% reduction. New right buttock and right lower extremity radicular pain has emerged, similar to pre‑epidural symptoms, limiting walking beyond 10 minutes.",
                        "source": "MD Reports"
                    },
                    {
                        "sub_header": "Prior Treatments and Response",
                        "content": "Lumbar epidural steroid injection on 05/20/2024 provided about 50% reduction in low back and lower extremity pain for approximately four months. Radiofrequency thermocoagulation to right L4‑L5 and L5‑S1 on 12/23/2024 resulted in roughly 80% reduction of low back pain.",
                        "source": "MD Reports"
                    },
                    {
                        "sub_header": "Functional Limitations and Impact on Occupation",
                        "content": "Unable to walk more than 10 minutes due to right lower extremity radicular symptoms, which may affect ability to perform duties as a machine operator.",
                        "source": "MD Reports"
                    },
                    {
                        "sub_header": "Work Status",
                        "content": "Not working since the injury on 05/15/2023.",
                        "source": "Multiple Reports"
                    }
                ]
            },
            {
                "main_header": "MEDICAL EXAMINATION",
                "content": "",
                "sub_sections": [
                    {
                        "sub_header": "Medical Diagnoses",
                        "content": "Low back pain\nlumbar facet syndrome with right L4‑L5 and L5‑S1 facet arthropathy\nmultilevel lumbar disc protrusion with facet arthropathy, foraminal narrowing, and abutment/distortion of exiting and traversing nerve roots\nright lower extremity radiculopathy with EMG/NCV positive for chronic L5 radiculopathy – improved following LESI\nlumbar facet arthropathy.",
                        "source": "MD Reports"
                    },
                    {
                        "sub_header": "Physical Examination Summary",
                        "content": "Vital signs: blood pressure 172/90 mmHg, heart rate 73 bpm, height 5'0\", weight 147 lbs. General: awake, alert, in discomfort. Low back: no tenderness over right lower paraspinal musculature or facet joints\nimproved range of motion with flexion to 45°, extension to 25°. Kemp’s test negative\nstraight leg raise positive on the right. Decreased sensation to light touch in the right L5 dermatome (new neurological finding).",
                        "source": "MD Reports"
                    },
                    {
                        "sub_header": "Medical Stability",
                        "content": "Medical stability is not explicitly stated\nthe patient continues to experience right lower extremity radicular symptoms and hypertension but no acute changes are reported.",
                        "source": "Multiple Reports"
                    },
                    {
                        "sub_header": "Medication Review",
                        "content": "Naproxen\nAspirin 81 mg daily\nJardiance 25 mg daily\nBasaglar U‑100 insulin 24 units daily\nBenazepril 40 mg daily\nPioglitazone 30 mg daily\nSimvastatin 40 mg daily\nMetformin 1000 mg twice daily\nMetoprolol tartrate 25 mg twice daily\nLevothyroxine 50 mcg daily.",
                        "source": "MD Reports"
                    },
                    {
                        "sub_header": "Medical Impression",
                        "content": "Low back pain\nlumbar facet syndrome with right L4‑L5 and L5‑S1 facet arthropathy\nmultilevel lumbar disc protrusion with foraminal narrowing\nright lower extremity radiculopathy (chronic L5) improved after prior LESI\nlumbar facet arthropathy.",
                        "source": "MD Reports"
                    }
                ]
            },
            {
                "main_header": "PHYSICAL THERAPY EVALUATION",
                "content": "",
                "sub_sections": [
                    {
                        "sub_header": "Functional Assessment",
                        "content": "Patient functions at a sedentary level\nunable to perform shopping, house chores, or walking\njob classified as medium‑heavy with frequent lifting, pulling, and pushing demands.",
                        "source": "PT Report"
                    },
                    {
                        "sub_header": "Movement Analysis",
                        "content": "Short step gait with flat feet, absent pelvic movement during walking\nable to perform heel raises\navoidance of right upper extremity and pelvic motion\ntenderness noted in lumbar/sacral/paraspinal region and right shoulder.",
                        "source": "PT Report"
                    },
                    {
                        "sub_header": "Effort and Consistency",
                        "content": "Demonstrated good effort to comply with evaluation.",
                        "source": "PT Report"
                    },
                    {
                        "sub_header": "Physical Limitations",
                        "content": "Sitting tolerance less than 15 minutes\nstanding tolerance less than 5 minutes\nwalking tolerance less than 15 minutes\nno repetitive movements tolerated\nlimited lumbar flexion to 47° and extension to 21°\nthoracic rotation limited to 20° right and 22° left\nright shoulder range of motion reduced by more than 75% with strength 3‑/5\nstrength deficits include thoracic rotation 3/5 (right) and 4‑/5 (left), lumbar flexion 3/5, extension 4‑/5, right lower extremity 3+/5, left lower extremity 4‑/5, right shoulder 3‑/5, left shoulder 4‑/5\ngrip strength 0 lb right, 5‑10 lb left\ntenderness over lumbar/sacral/paraspinal muscles and right shoulder\ngait with short steps, flat feet, and absent pelvic motion.",
                        "source": "PT Report"
                    },
                    {
                        "sub_header": "Occupational Demands",
                        "content": "Lifting approximately 30 lb from floor to waist all day two days per week\nlifting overhead about 2 lb to waistline all day one day per week\npulling a 50 lb pallet with wheels about 30 times per day 2‑3 days per week\nno lifting from waist to shoulder level or carrying items reported.",
                        "source": "PT Report"
                    },
                    {
                        "sub_header": "Objective Functional Findings",
                        "content": "Cervical range of motion within functional limits\nthoracic rotation right 20°, left 22°\nlumbar flexion 47°, extension 21°\nstrength grades as listed in the physical examination summary\ngrip strength right 0‑0 lb (x10), left 5‑10 lb (x10)\ntenderness over lumbar/sacral/paraspinal muscles and right shoulder\ngait characterized by short steps, flat feet, absent pelvic motion, able to perform heel raises.",
                        "source": "PT Report"
                    },
                    {
                        "sub_header": "Physical Therapy Impression",
                        "content": "Significant functional limitations including reduced lumbar range of motion and strength, low tolerance for sitting, standing, and walking, and inability to meet medium‑heavy occupational demands. The patient is unable to return to the previous job and requires a functional restorative program to improve range of motion, strength, and activity tolerances.",
                        "source": "PT Report"
                    }
                ]
            },
            {
                "main_header": "PSYCHOLOGY EVALUATION",
                "content": "",
                "sub_sections": [
                    {
                        "sub_header": "Psychosocial History and Current Psychosocial Functioning",
                        "content": "Ms. Carachure was born in Mexico, moved to California in 1988, grew up with married parents and several siblings, married since 1995 to a supportive husband, and has three adult children and seven grandchildren. She resides in Santa Ana, CA with her husband in a safe home environment and stable relationships. She is not working due to functional limitations from chronic pain but is highly motivated to increase functioning and return to gainful employment. Coping strategies include activity pacing, position changes, light movement, rest, and medication. She walks slowly for less than 15 minutes before pain forces cessation. Activities of daily living require extra time, pacing, and creative strategies\nshe needs assistance with more physically demanding household tasks. Social support is present but she reports increased social isolation secondary to pain. She experiences pain‑related insomnia characterized by difficulty initiating and maintaining sleep, leading to restless, broken sleep and worsening pain management.",
                        "source": "Psych Report"
                    },
                    {
                        "sub_header": "Substance Use History and Current Functioning",
                        "content": "Denies any previous or present alcohol or drug abuse.",
                        "source": "Psych Report"
                    },
                    {
                        "sub_header": "Psychiatric History and Current Psychiatric Functioning",
                        "content": "Denies history of auditory or visual hallucinations, mania, psychiatric hospitalizations, suicide attempts, psychotherapy, or pharmacotherapy. Currently reports significant depressive symptoms (depressed mood, anhedonia, low energy, decreased motivation, appetite disturbance, physical and emotional sluggishness) and significant anxiety symptoms (excessive rumination, difficulty controlling worry, restlessness, concentration problems, fatigue, muscle tension, sleep disturbance). No suicidal ideation. Pain catastrophizing is present at a clinically significant level.",
                        "source": "Psych Report"
                    },
                    {
                        "sub_header": "Mental Status Examination",
                        "content": "Patient arrived on time, appropriately groomed and dressed, pleasant and cooperative. Frequently shifted in seat due to pain. Maintained adequate eye contact\nspeech rate, rhythm, and volume within normal limits. Thought process linear, no thought content disturbances. Affect mood‑congruent with reported depression and anxiety. Oriented to person, place, time, and context. No evidence of hallucinations or delusions. Recent and remote memory within normal limits. Abstracting ability, judgment, and insight adequate.",
                        "source": "Psych Report"
                    },
                    {
                        "sub_header": "Psychological Testing",
                        "content": "Patient Health Questionnaire – General Somatic Problems Score: 8 (mild range of somatic complaints). Patient Health Questionnaire – Depression Score: 12 (moderate range). Generalized Anxiety Disorder‑7 Scale: score not provided (mild‑moderate range). Brief Pain Inventory – Pain Intensity Score: 7 (severe range). Brief Pain Inventory – Pain Interference Score: 6 (high moderate range). Pain Catastrophizing Scale (PCS): 33 (clinically significant).",
                        "source": "Psych Report"
                    },
                    {
                        "sub_header": "Summary And Psychosocial Treatment Recommendations",
                        "content": "Ms. Carachure is experiencing chronic low back pain accompanied by pain‑related insomnia, depression, and anxiety, which together exacerbate functional impairment. She is highly motivated to learn active, non‑pharmacologic pain management skills to improve daily functioning and return to work. Evaluator recommends participation in the Compass Pain and Wellness Functional Restoration Program to enhance functional abilities and pain self‑management. Identified treatment goals include conceptualizing pain beliefs and coping styles\neducating on the biopsychosocial model\nproviding psychoeducation on pain–mood–stress relationships\nteaching cognitive‑behavioral strategies for pain, stress, and mood\nimproving sleep via CBT, sleep hygiene, and somatic relaxation\nreducing depression and anxiety through CBT, ACT, and relaxation\nshifting from illness‑focused to wellness‑focused coping\napplying Pain Reprocessing Therapy\nincreasing vocational and avocational participation\nand monitoring treatment response. Patient‑identified goal: return to work.",
                        "source": "Psych Report"
                    }
                ]
            },
            {
                "main_header": "MULTIDISCIPLINARY TEAM SUMMARY",
                "content": "",
                "sub_sections": [
                    {
                        "sub_header": "Functional Restoration Program Determination",
                        "content": "Based on the convergence of persistent low back pain with radiculopathy, limited activity tolerances (sitting <15 min, standing <5 min, walking <15 min), significant strength and range‑of‑motion deficits, inability to meet medium‑heavy occupational demands, and pronounced psychosocial barriers including depression, anxiety, pain catastrophizing, and insomnia, the multidisciplinary team determines that the patient meets criteria for enrollment in a Functional Restoration Program.",
                        "source": "Multiple Reports"
                    },
                    {
                        "sub_header": "Guideline-Based Criteria for FRP Inclusion",
                        "content": "The psychosocial evaluation aligns with MTUS guideline recommendations that psychosocial assessments should determine need for further interventions and aid rehabilitation planning. The identified functional limitations, pain severity, and psychosocial factors satisfy guideline‑based criteria for FRP inclusion.",
                        "source": "Multiple Reports"
                    }
                ]
            }
        ],
        "patientInfo": {
            "name": "Albertina Carachure",
            "dob": "1961-02-25",
            "gender": "Female",
            "date_of_injury": "2023-05-15",
            "claim_number": "CWC230622950",
            "employer": "Corona Orange Foods Holdings, LLC",
            "age_at_consult": "63",
            "work_status": "Not Working"
        },
        "institution": {
            "name": "Compass Pain and Wellness",
            "address": "1901 E. 4th St. Suite 210, Santa Ana, CA. 92705",
            "phone": "(714) 542-5999",
            "fax": "(714) 475-6991"
        },
        "doctors": [
            "Michael H. Lowenstein, M.D.",
            "Jack O. Piasecki, M.D., PTP",
            "Russell Sanders, PA-C",
            "Acu Trans Solution, LLC",
            "Michael J. Bjornson, Ph.D",
            "Azita Yazdani"
        ]
    }

    return <PdfPreview data={mockData} />;
}
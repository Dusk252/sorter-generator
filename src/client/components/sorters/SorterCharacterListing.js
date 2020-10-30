import React from 'react';
import Image from './../general/ImageWithFallback';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { hexToRGBA } from './../../../helpers/hexToRGBA';

const groupedMap = (characters, groups) =>
    groups.map((group, index) => (
        <div className='group-info-wrapper' style={{ border: `2px solid ${group.color}`, borderRadius: '5px' }} key={index}>
            <div className='group-info-title' style={{ backgroundColor: hexToRGBA(group.color, 0.5) }}>
                {group.name} characters
            </div>
            <div className='group-info-char-list'>
                {characters
                    .filter((char) => char.group === index)
                    .map((char, index) => (
                        <div className='group-info-char' key={index}>
                            <Image src={char.picture} />
                            <div>{char.name}</div>
                        </div>
                    ))}
            </div>
        </div>
    ));
const ungroupedMap = (ungroupedCharacters) => (
    <div className='group-info-wrapper' style={{ border: `2px solid rgba(255, 255, 255, 0.5)`, borderRadius: '5px' }}>
        <div className='group-info-title' style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}>
            Ungrouped characters
        </div>
        <div className='group-info-char-list'>
            {ungroupedCharacters.map((char, index) => (
                <div className='group-info-char' key={index}>
                    <Image src={char.picture} />
                    <div>{char.name}</div>
                </div>
            ))}
        </div>
    </div>
);

const SorterCharacterListing = ({ characters, groups, columnsCountBreakPoints = { 350: 2, 750: 3 }, gutter = '15px' }) => {
    const ungroupedCharacters = characters == null ? [] : characters.filter((char) => char.group == null);

    return (
        <div className='group-info'>
            <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
                <Masonry gutter={gutter}>
                    {groups != null && groups.length > 0 && ungroupedCharacters.length > 0 ? (
                        <>
                            {groupedMap(characters, groups)}
                            {ungroupedMap(ungroupedCharacters)}
                        </>
                    ) : groups != null && groups.length > 0 && ungroupedCharacters.length === 0 ? (
                        groupedMap(characters, groups)
                    ) : groups == null || groups.length === 0 ? (
                        ungroupedMap(ungroupedCharacters)
                    ) : (
                        <></>
                    )}
                </Masonry>
            </ResponsiveMasonry>
        </div>
    );
};

export default SorterCharacterListing;
